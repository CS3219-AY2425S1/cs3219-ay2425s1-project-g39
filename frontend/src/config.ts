interface Config {
  ROOT_BASE_API: string;
}

const config: Config = {
  ROOT_BASE_API: import.meta.env.VITE_ROOT_BASE_API || 'https://localhost/',
};

export default config;
