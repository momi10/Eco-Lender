// Project reducer
const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1
  }
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PROJECTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload.projects,
        pagination: action.payload.pagination,
        loading: false
      };

    case 'FETCH_PROJECTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'SELECT_PROJECT':
      return {
        ...state,
        selectedProject: action.payload
      };

    case 'CREATE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: [action.payload, ...state.projects]
      };

    default:
      return state;
  }
};

export default projectReducer;
