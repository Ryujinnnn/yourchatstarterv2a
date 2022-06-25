const db = require('../database/database_interaction')
const { service_access_tier } = require('../database/session_storage')

module.exports.updateServicePermission = async () => {
    let sv_res = await db.queryRecord('service', {}, {}).catch(err => console.log(err))

    let user_perm = new Map()

    if (sv_res && sv_res.length > 0) {
        const EXCLUDED_FIELD = ["name", "_id"]
        sv_res.forEach(element => {
            let entries = Object.entries(element)
            let name_map = {
                "basic": ["free", "none"],
                "standard": ["standard"],
                "premium": ["premium", "lifetime"]
            }
            let plan_name = element.name
            entries.forEach((val) => {
                if (EXCLUDED_FIELD.includes(val[0])) return
                if (!user_perm.get(val[0])) {
                    user_perm.set(val[0], [])
                }
                if (val[1]) {
                    user_perm.set(val[0], user_perm.get(val[0]).concat(name_map[plan_name] || []))
                }
            })
        });

        user_perm.forEach((val, key) => {
            service_access_tier[key] = val
        })

    }
}