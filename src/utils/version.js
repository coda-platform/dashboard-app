import { version } from '../../version.json';

function getBuildVersion() {
    try {
        return version.replace(/(\r\n|\n|\r)/gm, "");
    } catch (e) {
        return 'Unknown Version'
    }
}

export default {
    getBuildVersion
}