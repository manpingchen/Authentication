import { useReducer } from "react";

const initialInputState = {
  value: "",
  isTouched: false,
};

const inputReducer = (state, action) => {
  if (action.type === "VALUE_CHANGE") {
    return {
      value: action.value,
      isTouched: state.isTouched,
    };
  }
  if (action.type === "BLUR") {
    return {
      value: state.value,
      isTouched: true,
    };
  }
  if (action.type === "RESET") {
    return {
      value: "",
      isTouched: false,
    };
  }
  return state;
};

const useInput = (shouldValid = false, validationFunction) => {
  const [inputState, dispatch] = useReducer(inputReducer, initialInputState);

  const isValueValid = shouldValid && validationFunction(inputState.value);
  const hasError = !isValueValid && inputState.isTouched;

  const inputChangeHandler = (event) => {
    dispatch({ type: "VALUE_CHANGE", value: event.target.value });
  };

  const inputBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };

  const inputRestHandler = () => {
    dispatch({ type: "RESET" });
  };

  return {
    value: inputState.value,
    inputChangeHandler,
    inputBlurHandler,
    inputRestHandler,
    isValueValid,
    hasError,
  };
};

export default useInput;
