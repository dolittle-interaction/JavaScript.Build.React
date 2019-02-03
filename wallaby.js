//TODO: Rely on @dolittle/build/wallaby 
// const wallaby = require('@dolittle/build/dist/wallaby/node')
// module.exports = wallaby('.', () => {});

const babelConfigLoader = require('@dolittle/build/dist/babelConfigLoader').default;
const babelConfig = babelConfigLoader('.');
module.exports = function (sourceFolder, wallabySettingsCallback) {
    if (sourceFolder === undefined || sourceFolder === null) sourceFolder = 'Features';
    return (wallaby) => {
        const babelCompiler = wallaby.compilers.babel(babelConfig);
        let wallabyConfig = {
            files: [
                { pattern: 'node_modules/chai/chai.js', instrument: false },
                { pattern: 'node_modules/chai-as-promised/chai-as-promised.js', instrument: false },
                { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
                { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
                { pattern: `${sourceFolder}/**/for_*/**/*.js`, ignore: true },
                { pattern: `${sourceFolder}/**/dist/**/*.js`, ignore: true },
                { pattern: `${sourceFolder}/**/*.js` }
            ],
            tests: [
                { pattern: `${sourceFolder}/**/dist/**/for_*/**/*.js`, ignore: true },
                { pattern: `${sourceFolder}/**/for_*/**/*.js` }
            ],
            testFramework: 'mocha',
            compilers: {
                '**/*.js*': babelCompiler
            },
            env: {
                // Should not be node
                type: 'node'
            },
            setup: () => {
                global.expect = chai.expect;
                let should = chai.should();
                global.sinon = require('sinon');
                let sinonChai = require('sinon-chai');
                chai.use(sinonChai);
                let sinonChaiInOrder = require('sinon-chai-in-order').default;
                chai.use(sinonChaiInOrder);
    
                let winston = require('winston');
                global.logger = winston.createLogger({});
            }
        };
        if (typeof wallabySettingsCallback === 'function') wallabySettingsCallback(wallabyConfig);

        return wallabyConfig;
    }
};