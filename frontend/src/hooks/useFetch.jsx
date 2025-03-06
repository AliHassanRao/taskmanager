import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import api from "../api"; // Assuming api is an Axios instance

const useFetch = () => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    successMsg: "",
    errorMsg: "",
  });

  const fetchData = useCallback(
    async (config, otherOptions = {}) => {
      const { showSuccessToast = true, showErrorToast = true } = otherOptions;
      
      setState((prevState) => ({ ...prevState, loading: true }));

      try {
        // Make the API request
        const response = await api.request(config);
        const { data } = response; // Assuming Axios response

        setState({
          loading: false,
          data,
          successMsg: data.msg || "Success",
          errorMsg: "",
        });

        // Optionally show success toast
        if (showSuccessToast && data.msg) {
          toast.success(data.msg);
        }

        return data;
      } catch (error) {
        // Determine error message
        const msg =
          error.response?.data?.msg ||
          error.message ||
          "An error occurred. Please try again.";

        setState({
          loading: false,
          data: null,
          errorMsg: msg,
          successMsg: "",
        });

        // Optionally show error toast
        if (showErrorToast) {
          toast.error(msg);
        }

        return Promise.reject(new Error(msg));
      }
    },
    [] // Dependency array can remain empty, as state updates are handled internally
  );

  return [fetchData, state];
};

export default useFetch;
