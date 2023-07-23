const paths = {
  base: "/api",
  user: {
    base: "/user",
    getPersonalInformation: "/personal-information",
    createPersonalInformation: "/personal-information",
    updatePersonalInformation: "/personal-information",
    getAllPersonalInformation: "/",
  },
  credential: {
    base: "/auth",
    logIn: "/log-in",
    signUp: "/sign-up",
  },
};

export default Object.freeze(paths);
