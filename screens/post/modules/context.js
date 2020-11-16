import createContext from 'react-recontext';
import _ from 'lodash';

const initState = {
  id: null, // edit ad
  category: {
    field: null,
    item: null,
  },
  location: {
    district: null,
    city: null,
  },
  title: null,
  price: null,
  description: null,
  photos: [],
  removePhotos: [], // edit ad
  fields: {},
  phone: [],
};

export const { dispatch, Context, Provider } = createContext({
  displayName: 'PostContext',
  initState,
  actions: {
    SET_CATEGORY: (state, category) => ({
      ...state,
      category: category,
    }),
    SET_LOCATION: (state, location) => ({
      ...state,
      location: location,
    }),
    SET_TITLE: (state, title) => ({
      ...state,
      title,
    }),
    SET_PRICE: (state, price) => ({
      ...state,
      price,
    }),
    SET_DESCRIPTION: (state, description) => ({
      ...state,
      description,
    }),
    SET_PHOTOS: (state, photos) => ({
      ...state,
      photos,
    }),
    SET_REMOVE_PHOTOS: (state, removePhotos) => ({
      ...state,
      removePhotos,
    }),
    SET_FIELDS: (state, { field, value }) => ({
      ...state,
      fields: { ...state.fields, [field]: value },
    }),
    RESET_FIELDS: (state) => ({
      ...state,
      fields: {},
    }),
    SET_PHONE: (state, phone) => ({
      ...state,
      phone,
    }),
    RESET_CONTEXT: () => initState,
    SET_CONTEXT: (_, ad) => ad,
  },
  isEnableLog: false,
});
