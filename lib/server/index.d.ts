declare const server: (config: {
    controllers: any[];
    services: any[];
    whiteList?: string[];
    port?: number;
}) => void;
export default server;
