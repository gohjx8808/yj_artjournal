import { useMutation, useQuery } from "react-query";
import { useAppDispatch } from "../../../hooks";
import { toggleLoadingOverlay } from "../../overlay/src/overlayReducer";
import {
  toggleStatusModal,
  toggleSuccess,
  updateStatusMsg,
  updateStatusTitle,
} from "../../status/src/statusReducer";
import { getCurrentUserDetails, signOut } from "./authApis";
import { uidStorageKey } from "./authConstants";

export const getCurrentUserDetailsKey = "getCurrentUserDetails";

export const useLogout = () =>
  useMutation("signOut", signOut, {
    onSuccess: () => localStorage.clear(),
  });

export const useUserDetails = (onAdditionalSuccess?: () => void) => {
  const dispatch = useAppDispatch();
  const { mutate: logout } = useLogout();

  return useQuery(
    getCurrentUserDetailsKey,
    async () => {
      const uid = localStorage.getItem(uidStorageKey) || "";
      const response = await getCurrentUserDetails(uid);

      const parsedResponse: auth.currentUserDetails = response.val();
      return parsedResponse;
    },
    {
      onSuccess: (response) => {
        try {
          const userDetails: auth.userDetails = response;
          if (userDetails.roles.customer) {
            dispatch(toggleLoadingOverlay(false));
            if (onAdditionalSuccess) {
              onAdditionalSuccess();
            }
          } else {
            logout();
            throw new Error("No permission");
          }
        } catch (error) {
          dispatch(updateStatusTitle("Log In"));
          dispatch(updateStatusMsg("Invalid credentials! Please try again."));
          dispatch(toggleSuccess(false));
          dispatch(toggleLoadingOverlay(false));
          dispatch(toggleStatusModal(true));
        }
      },
      enabled: !!localStorage.getItem(uidStorageKey),
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
};