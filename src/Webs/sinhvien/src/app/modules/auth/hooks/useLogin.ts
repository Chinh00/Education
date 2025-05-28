import { useMutation } from "@tanstack/react-query";
import { getAccessTokenFromServer, getTestAccessTokenFromServer } from "../services/login.service"

const useLogin = () => {
  return useMutation({
    mutationKey: ["useLogin"],
    mutationFn: getTestAccessTokenFromServer
  })
}
const useLoginMicrosoft = () => {
  return useMutation({
    mutationKey: ["useLoginMicrosoft"],
    mutationFn: getAccessTokenFromServer
  })
}
export { useLogin, useLoginMicrosoft }
