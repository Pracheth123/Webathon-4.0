import { create } from "zustand";
import { mockVolunteerRequests } from "../data/mockRequests";

export const useVolunteerStore = create((set, get) => ({
  requests: mockVolunteerRequests || [],

  addRequest: (req) =>
    set((state) => ({
      requests: [{ id: `req_${Date.now()}`, ...req }, ...state.requests],
    })),

  approveRequest: (id) =>
    set((state) => ({ requests: state.requests.filter((r) => r.id !== id) })),

  rejectRequest: (id) =>
    set((state) => ({ requests: state.requests.filter((r) => r.id !== id) })),
}));

export default useVolunteerStore;
