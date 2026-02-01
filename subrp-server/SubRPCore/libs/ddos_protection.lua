local ddos_protection = {}

local connection_counts = {}

local config = {
    max_connections = 3,
    time_interval = 30,
    ban_time = 300,
    whitelist = {
        "127.0.0.1",
        "192.168.1.1"
    }
}

function ddos_protection.check_ip(ip)
    for _, allowed_ip in ipairs(config.whitelist) do
        if ip == allowed_ip then
            return true
        end
    end
    
    local current_time = os.time()

    if not connection_counts[ip] then
        connection_counts[ip] = {
            count = 0,
            last_seen = current_time,
            banned_until = 0
        }
    end
    
    local ip_data = connection_counts[ip]
    
    if ip_data.banned_until > current_time then
        return false, "IP заблокирован за подозрительную активность"
    end

    if current_time - ip_data.last_seen > config.time_interval then
        ip_data.count = 0
        ip_data.last_seen = current_time
    end
    
    ip_data.count = ip_data.count + 1
    
    if ip_data.count > config.max_connections then
        ip_data.banned_until = current_time + config.ban_time
        return false, "Слишком много подключений с вашего IP"
    end
    
    return true
end

function ddos_protection.cleanup()
    local current_time = os.time()
    for ip, data in pairs(connection_counts) do
        if current_time - data.last_seen > 2 * config.time_interval and data.banned_until <= current_time then
            connection_counts[ip] = nil
        end
    end
end

return ddos_protection