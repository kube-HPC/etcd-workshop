const prettyjson = require('prettyjson');
const { Etcd3 } = require('etcd3');

const hosts = 'http://localhost:4001';
const client = new Etcd3({ hosts });

const path = `/keys`;

// register service
const put = (key, value) => {
    log(`set key at ${path}/${key}...`);
    return client.put(`${path}/${key}`).value(JSON.stringify(value));
};

const deleteKey = (key) => {
    log(`delete key at ${path}/${key}...`);
    return client.delete().key(`${path}/${key}`)
};

// watch
const watchKey = () => {
    log(`start watching path prefix ${path} ...`);
    return client.watch().prefix(path).create();
};

// get list
const list = (sort, limit) => {
    return client.getAll()
        .prefix(path)
        .sort(...sort)
        .limit(limit);
};

const log = (data) => {
    console.log(prettyjson.render(data));
};

const main = async () => {
    const watch = await watchKey();
    watch.on('put', (res) => {
        const key = res.key.toString();
        const data = JSON.parse(res.value.toString());
        log(`key updated ${key}`);
        log(data);
    });
    watch.on('delete', (res) => {
        const [, , key] = res.key.toString().split('/');
        log(`key deleted ${key}`);
    });

    await put('bar1', { foo: 'bar-1' });
    await put('bar2', { foo: 'bar-2' });
    await put('bar3', { foo: 'bar-3' });
    await put('bar4', { foo: 'bar-4' });
    await put('bar5', { foo: 'bar-5' });

    await deleteKey('bar1');

    const keys = await list(sort = ['Mod', 'Ascend'], 3);
    log(`get top 3 keys`);
    log(keys);
};

main();