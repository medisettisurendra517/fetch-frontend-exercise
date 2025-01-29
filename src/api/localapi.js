const LocalApi = {

    setUserInfo: (name, email) => {
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
      },

    getUserInfo: () => {
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        return { name, email };
    },

    clearUserInfo: () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
    },

  };
  
  export default LocalApi;
  