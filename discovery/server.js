const prettyjson = require('prettyjson');
const { Etcd3 } = require('etcd3');

const hosts = 'http://localhost:4001';
const client = new Etcd3({ hosts });

const basePath = '/services';
const path = `${basePath}/iam_service`;

// discover service
const discover = () => {
    log(`starting service discovery...`);
    return client.watch().prefix(basePath).create();
};

const log = (data) => {
    console.log(prettyjson.render(data));
};

const main = async () => {
    const watch = await discover();
    watch.on('put', (res) => {
        const key = res.key.toString();
        const data = JSON.parse(res.value.toString());
        log(`new service discovered at ${key}`);
        log(data);
    });
    watch.on('delete', (res) => {
        const [, , service] = res.key.toString().split('/');
        log(`service deleted ${service}`);
    });
};

main();



