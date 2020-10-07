import { User } from "../types";

interface MenuItem {
  label: string;
  url: string;
  access?: "admin" | "authenticated" | "guest";
}

const menuItems: {
  [key: string]: MenuItem[];
} = {
  main: [
    {
      label: "Log in",
      url: "/login",
      access: "guest",
    },
  ],
};

const getMenu = (name: string, user: User | null) => {
  return menuItems[name].filter(({ access }) => {
    if (access === undefined) {
      return true;
    }
    switch (access) {
      case "admin":
        return user !== null && user.isAdmin;
      case "authenticated":
        return user !== null;
      case "guest":
        return user === null;
      default:
        throw new Error(`Access value "${access}" is invalid.`);
    }
  });
};

export default getMenu;
