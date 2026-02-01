dev_mode = false

logger = require('libs.logger')

os.setlocale("C", "ctype")
os.execute("chcp 65001 > nul")
error_start = false


if package.config:sub(1, 1) == "\\" then
    os.execute("cls")
    -- dir_server = "C:/Users/Jastickon/Desktop/SubRolePlay/Resources/"
    dir_server = "E:/SubRolePlay/Resources/"
else
    os.execute("clear")
    dir_server = "/home/container/SubRolePlay/"
end


function start_server()
    M = {}
    print("-----------------------------------------------------------")
    json = require('libs.json')
    require('libs.math')
    require('libs.start')
    if dev_mode then
        dev_status("dev")
    else
        dev_status("start")
    end
end

function onInit()
    start_server()
    create_folders()
    print("-----------------------------------------------------------")


    timer_minute()
    Anticheat.loading()
    log_start()



    local data = {
        user_online = {},
        cars = {}
    }
    DataManager.update_data("api", "players.json", data)
    if dev_mode then
        dev_status("dev")
    else
        dev_status("active")
    end

end
