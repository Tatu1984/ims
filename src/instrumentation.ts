export async function onRequestError(
  err: { digest: string },
  request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "middleware";
    renderSource:
      | "react-server-components"
      | "react-server-components-payload"
      | "server-rendering";
  }
) {
  // Structured server-side error logging
  // Replace with Sentry/Datadog when ready:
  // Sentry.captureException(err, { extra: { request, context } });
  console.error(
    JSON.stringify({
      type: "server_error",
      digest: err.digest,
      path: request.path,
      method: request.method,
      routePath: context.routePath,
      routeType: context.routeType,
      routerKind: context.routerKind,
      timestamp: new Date().toISOString(),
    })
  );
}
