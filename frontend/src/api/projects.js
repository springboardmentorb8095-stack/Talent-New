import axiosInstance from "./axiosInstance";

// Client: create project
export const createProject = (data) =>
  axiosInstance.post("/projects/my-projects/", data);

// Client: my projects
export const getMyProjects = () =>
  axiosInstance.get("/projects/my-projects/");

// Client: proposals for a project
export const getProjectProposals = (projectId) =>
  axiosInstance.get(`/projects/${projectId}/proposals/`);

export const browseProjects = (query = "") =>
  axiosInstance.get(`/projects/browse/${query}`);

// Freelancer: browse projects
// export const browseProjects = () =>
//   axiosInstance.get("/projects/browse/");
