// Loan reducer
const initialState = {
  loans: [],
  selectedLoan: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1
  }
};

const loanReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_LOANS_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_LOANS_SUCCESS':
      return {
        ...state,
        loans: action.payload.loans,
        pagination: action.payload.pagination,
        loading: false
      };

    case 'FETCH_LOANS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'SELECT_LOAN':
      return {
        ...state,
        selectedLoan: action.payload
      };

    default:
      return state;
  }
};

export default loanReducer;
