const prettyjson = require('prettyjson');
const { Etcd3 } = require('etcd3');

const hosts = 'http://localhost:4001';
const client = new Etcd3({ hosts });

const basePath = '/services';
const path = `${basePath}/iam_service`;

// register service
const register = (ttl, value) => {
    log(`registering service at ${path}...`);
    const lease = client.lease(ttl);
    return lease.put(path).value(JSON.stringify(value));
};

const log = (data) => {
    console.log(prettyjson.render(data));
};

const main = async () => {
    const url = { host: '10.40.20.1', port: 3001 };
    await register(10, url);
};

main();



