log_debug("Запуск system/ApiEngine.lua")

function send_dc_message(channel_id, content)
    local api_dc_message = DataManager.load_data("api", "message_discord.json") or {}
    
    table.insert(api_dc_message, {
        channel_id = channel_id,
        content = content,
        timestamp = os.time()
    })
    
    DataManager.update_data("api", "message_discord.json", api_dc_message)
end



function dev_status(status)
    
    data = {
        status = status
    }
    
    DataManager.update_data("api", "server_status.json", data)
end