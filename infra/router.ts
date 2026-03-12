const domain =
  $app.stage === "production"
    ? "exec0.run"
    : $app.stage === "dev"
      ? "dev.exec0.run"
      : undefined;

export const exec0Router = new sst.aws.Router("Exec0Router", {
  domain: domain,
});
