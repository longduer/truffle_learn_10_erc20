module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks:{
        development: {
            host: "192.168.23.164",
            port:"8545",
            gas: 8000000,
            network_id: "1",
            from: "0xed64d1986e7861d0c51c0c5d24a91eb80340da62"
        }
    }
};
