import React, { useEffect, useState } from "react";
import LocalApi from "../api/localapi";
import FetchApi from "../api/fetchapi";
import ReactSlider from 'react-slider';
import nodogImage from "../assets/no-dogs.png";

const TailMateHomePage = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [breeds, setBreeds] = useState([]);
  const [filters, setFilters] = useState({
    breed: '',
    zipCodes: '',
    ageMin: 0,
    ageMax: 15
  });
  const [dogs, setDogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12, totalPages: 0 });
  const [sortField, setSortField] = useState("breed");
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [apply, setApply] = useState(false);
  const [matchList, setMatchList] = useState([]);
  const [isFilterListVisible, setIsFilterListVisible] = useState(true);
  const [matchedDog, setMatchedDog] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const breedData = await FetchApi.allBreedNames();
        if (breedData?.data) {
          setBreeds(breedData.data);
        }
      } catch (error) {
        console.error('Error fetching breeds:', error.message);
      }

      const user = LocalApi.getUserInfo();
      if (user?.name && user?.email) {
        setUserInfo({ name: user.name, email: user.email });
      }
    };

    fetchData();
    applyFilters();
  }, []);


  useEffect(() => {
    const fetchDogs = async () => {
      setLoading(true);
      try {
        const searchParams = {
          breeds: filters.breed ? [filters.breed] : [],
          zipCodes: filters.zipCodes ? [filters.zipCodes] : [],
          ageMin: filters.ageMin || undefined,
          ageMax: filters.ageMax || undefined,
          size: pagination.pageSize,
          from: pagination.page > 1 ? (pagination.page - 1) * pagination.pageSize : 0,
          sort: `${sortField}:${sortOrder}`,
        };


        const searchResults = await FetchApi.searchDogs(searchParams);
        const dogDetails = await FetchApi.fetchDogsByIds(searchResults.data.resultIds);
        setDogs(dogDetails.data);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(searchResults.data.total / pagination.pageSize),
        }));
        setApply(false);

      } catch (error) {
        console.error("Error fetching dogs:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDogs();
  }, [apply]);


  const applyFilters = async () => {
    setApply(true);
  }


  const handleFindMatch = async () => {
    try {
      const dogIds = matchList.map(dog => dog.id);
      const response = await FetchApi.matchDog(dogIds);
      const matchedDogData = await FetchApi.fetchDogsByIds([response.data.match]);
      setMatchedDog(matchedDogData.data[0]);
      setPopupVisible(true);
      clearMatchList();

    } catch (error) {
      console.error("Error finding match:", error);
    }
  };

  const clearMatchList = async () => {
    setMatchList([]);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };


  const handleAddRemoveFromMatchList = (currentDog) => {

    setMatchList((prevMatchList) => {
      if (!Array.isArray(prevMatchList)) {
        return [];
      }

      const existingDogIndex = prevMatchList.findIndex(dog => dog.id === currentDog.id);

      if (existingDogIndex !== -1) {
        return prevMatchList.filter(dog => dog.id !== currentDog.id);
      } else {
        return [...prevMatchList, {
          id: currentDog.id,
          name: currentDog.name,
          breed: currentDog.breed,
          img: currentDog.img
        }];
      }
    });
  };



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAgeChange = (value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ageMin: value[0],
      ageMax: value[1]
    }));
  };

  const goToNextPage = () => {
    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    applyFilters();
  };

  const goToPreviousPage = () => {
    setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    applyFilters();
  };


  const clearFilters = () => {
    setFilters({
      breed: '',
      zipCodes: '',
      ageMin: 0,
      ageMax: 15
    });
    setSortField('breed');
    setPagination({ ...pagination, page: 1 });
    applyFilters();
  };

  const toggleFilterListVisibility = () => {
    setIsFilterListVisible(prevState => !prevState);
  };

  const handleRemoveFavourite = (dogId) => {
    setMatchList((prevMatchList) => {
      if (!Array.isArray(prevMatchList)) {
        return [];
      }

      const existingDogIndex = prevMatchList.findIndex(dog => dog.id === dogId);

      if (existingDogIndex !== -1) {
        return prevMatchList.filter(dog => dog.id !== dogId);
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1>Welcome, {userInfo.name || "Guest"}!</h1>
          {userInfo.email && <p>Email: {userInfo.email}</p>}
        </div>
      </div>

      <div className="row mt-4">

        {/* ==============================================Left Side With Filters====================================================  */}

        <div className="col-md-3 mb-4">
          <div className="bg-light p-3 rounded shadow-sm">
            <button className="btn-tailmate w-100 mb-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFavourites" aria-controls="offcanvasFavourites">Your Favourites</button>
            {matchList.length > 1 ? (
              <button className="btn-tailmate w-100" onClick={handleFindMatch}>
                Find Match
              </button>
            ) : (
              <p><i>Please add at least 2 dogs to find your best match</i></p>
            )}
          </div>

          <br />
          <div className="bg-light p-3 rounded shadow-sm">
            <h5 onClick={toggleFilterListVisibility} className="cursor-pointer">
              Search & Filter
              <span style={{ float: "right" }}>
                {isFilterListVisible ? "▲" : "▼"}
              </span>
            </h5>
            {isFilterListVisible && (
              <div>
                <div className="mt-3">
                  <label htmlFor="breedFilter">Breed</label>
                  <select
                    id="breedFilter"
                    className="form-select"
                    name="breed"
                    onChange={handleFilterChange}
                    value={filters.breed}>
                    <option value="">All Breeds</option>
                    {breeds.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <label htmlFor="sortField">Sort With</label>
                  <select
                    id="sortField"
                    className="form-select"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                  >
                    <option value="breed">Breed</option>
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                  </select>
                </div>

                <div className="mt-3">
                  <label htmlFor="sortOrder">Sort By</label>
                  <select
                    id="sortOrder"
                    className="form-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div className="mt-2">
                  <label htmlFor="zipCodeFilter" className="mb-1">Zip Code</label>
                  <input
                    type="text"
                    id="zipCodeFilter"
                    className="form-control"
                    name="zipCodes"
                    onChange={handleFilterChange}
                    value={filters.zipCodes}
                    placeholder="Enter Zip Code"
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="ageRange">Age Range</label>
                  <ReactSlider
                    value={[filters.ageMin, filters.ageMax]}
                    onChange={handleAgeChange}
                    min={0}
                    max={15}
                    minDistance={1}
                    className="horizontal-slider mt-1"
                    thumbClassName="thumb"
                    trackClassName="track"
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <span>{filters.ageMin} years</span>
                    <span>{filters.ageMax} years</span>
                  </div>
                </div>

                <div className="mt-2">
                  <button
                    className="btn-tailmate w-100 mt-2"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                  <button
                    className="btn-tailmate w-100 mt-2"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ==============================================Right Side With Pagination====================================================  */}
        <div className="col-md-9">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border spin-color" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              {dogs.length > 0 && (
                <div className="d-flex justify-content-between mb-4">
                  <button className="btn-tailmate btn-tailmate-rounded" onClick={goToPreviousPage} disabled={pagination.page === 1}>Previous</button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button className="btn-tailmate btn-tailmate-rounded" onClick={goToNextPage} disabled={pagination.page === pagination.totalPages}> Next </button>
                </div>
              )}
              <div className="row">
                {dogs.length === 0 ? (
                  <div className="col-12 d-flex justify-content-center align-items-center">
                    <img
                      src={nodogImage}
                      alt="Cute dog"
                      className="tailmate-home-image img-fluid mt-4"
                    />
                    <h5>No dogs found matching your criteria.</h5>
                  </div>
                ) : (
                  dogs.map((dog) => (
                    <div key={dog.id} className="col-md-4 mb-4">
                      <div className="card h-100">
                        <img
                          src={dog.img}
                          className="card-img-top"
                          alt={dog.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{dog.name}</h5>
                          <p className="card-text">
                            <strong>Breed:</strong> {dog.breed}<br />
                            <strong>Age:</strong> {dog.age} years<br />
                            <strong>Zip Code:</strong> {dog.zip_code}
                          </p>
                        </div>
                        <div className="card-footer">
                          <button
                            className={`${matchList.findIndex(dogItem => dogItem.id === dog.id) !== -1 ? 'btn-tailmate btn-tailmate-rounded w-100' : 'btn-tailmate btn-tailmate-outline btn-tailmate-rounded w-100'}`}
                            onClick={() => handleAddRemoveFromMatchList(dog)}
                          >
                            {matchList.findIndex(dogItem => dogItem.id === dog.id) !== -1 ? 'Remove from Favourites' : 'Add to Favourites'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {dogs.length > 0 && (
                <div className="d-flex justify-content-between mt-4">
                  <button className="btn-tailmate btn-tailmate-rounded" onClick={goToPreviousPage} disabled={pagination.page === 1}>Previous</button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button className="btn-tailmate btn-tailmate-rounded" onClick={goToNextPage} disabled={pagination.page === pagination.totalPages}> Next </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==============================================PopUps====================================================  */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasFavourites" aria-labelledby="offcanvasFavouritesLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasFavouritesLabel">Your Favourites</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <p>{matchList.length} dog(s) in your Favourites</p>
          <div className="row">
            {matchList.length > 0 && matchList.map((dog) => (
              <div key={dog.id} className="row-md-4 mb-2 mt-2">
                <div className="d-flex align-items-center">
                  <img
                    src={dog.img}
                    alt={dog.name}
                    className="rounded-circle-img"
                  />
                  <div className="ms-3">
                    <p className="m-0"><strong>{dog.name}</strong></p>
                    <p className="m-0">{dog.breed}</p>
                  </div>
                  <div className="ms-auto">
                    <button
                      className="btn-tailmate btn-tailmate-rounded btn-tailmate-outline"
                      onClick={() => handleRemoveFavourite(dog.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="col d-flex flex-column">
              {matchList.length > 0 && (
                <button className="btn-tailmate w-100 mt-2 mb-2" onClick={clearMatchList}>
                  Clear Favourites
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPopupVisible && matchedDog && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>
              &times;
            </button>
            <h3>Your Perfect Furry Companion</h3>
            <p><strong>Name:</strong> {matchedDog.name}</p>
            <p><strong>Breed:</strong> {matchedDog.breed}</p>
            <p><strong>Age:</strong> {matchedDog.age}</p>
            <p><strong>Zip Code:</strong> {matchedDog.zip_code}</p>
            <img
              src={matchedDog.img}
              alt={matchedDog.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TailMateHomePage;
