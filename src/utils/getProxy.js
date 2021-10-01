
import CONFIG from '@/config.json'
import CRC32 from 'crc-32'

export default {
    install(Vue)  {
        Vue.prototype.getProxy = (id) => {
            if (id == undefined || id == "") {
                return ""
            }
            var hash = CRC32.str(id.toString())
            return CONFIG.IMAGE_PROXY_HOSTS[Math.abs(hash) % CONFIG.IMAGE_PROXY_HOSTS.length]
        },
        Vue.prototype.getApiHost = (id) => {
            if (id == undefined || id == "") {
                return ""
            }
            var hash = CRC32.str(id.toString())
            return CONFIG.API_HOSTS[Math.abs(hash) % CONFIG.API_HOSTS.length]
        }
    }
}