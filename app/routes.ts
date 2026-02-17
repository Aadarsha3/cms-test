import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // Splat route to allow the internal wouter router to handle all paths
  route("*", "routes/splat.tsx"),
] satisfies RouteConfig;
