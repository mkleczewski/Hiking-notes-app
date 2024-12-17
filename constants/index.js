export const themes = [
  { value: 'light', label: 'Light', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'Dark', icon: '/assets/icons/moon.svg' },
  { value: 'system', label: 'System', icon: '/assets/icons/computer.svg' },
];

export const sideBarLogoutLink = {
  imgURL: '/assets/icons/',
  route: '/',
  label: 'Home',
};

export const sidebarLinks = [
  {
    imgURL: '/assets/icons/like.svg',
    route: '/szlaki',
    label: 'Szlaki',
  },
  {
    imgURL: '/assets/icons/star.svg',
    route: '/ksiazeczka',
    label: 'Książeczka',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/profil',
    label: 'Profil',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/regiony',
    label: 'Regiony',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/odznaki',
    label: 'Odznaki',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/regulamin',
    label: 'Regulamin',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/onas',
    label: 'O nas',
  },
];

export const adminLinks = [
  {
    imgURL: '/assets/icons/user.svg',
    route: '/crud/subregions',
    label: 'Podregiony',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/crud/regions',
    label: 'Regiony',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/crud/users',
    label: 'Użytkownicy',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/crud/places',
    label: 'Miejsca',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/crud/routes',
    label: 'Szlaki',
  },
];
