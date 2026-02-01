local config = {
    version = "0.0.1",
    modules = {
        speedhack = 'anticheat.ac_core.speedhack',
        teleport = 'anticheat.ac_core.teleport',
        log = 'anticheat.lib.logger'
    }
}

local Anticheat = {}

-- Таблица с цветами для консоли
local colors = {
    red = "\27[31m",
    blue = "\27[34m",
    cyan = "\27[36m",
    yellow = "\27[33m",
    magenta = "\27[35m",
    reset = "\27[0m"
}

-- Логотип античита
local logo = [[.

████████╗██╗   ██╗██████╗      █████╗ ██████╗ ███╗   ███╗ ██████╗ ██████╗ 
██╔════╝██║   ██║██╔══██╗    ██╔══██╗██╔══██╗████╗ ████║██╔═══██╗██╔══██╗
███████╗██║   ██║██████╔╝    ███████║██████╔╝██╔████╔██║██║   ██║██████╔╝
╚════██║██║   ██║██╔══██╗    ██╔══██║██╔══██╗██║╚██╔╝██║██║   ██║██╔══██╗
███████║╚██████╔╝██████╔╝    ██║  ██║██║  ██║██║ ╚═╝ ██║╚██████╔╝██║  ██║
╚══════╝ ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝
]]

function Anticheat.loading()
    -- Загружаем модули через цикл
    for name, path in pairs(config.modules) do
        local status, module = pcall(require, path)
        if status then
            Anticheat[name] = module
            print(colors.blue .. "[Anticheat] " .. colors.reset .. "Модуль " .. 
                  colors.yellow .. name .. colors.reset .. " успешно загружен")
        else
            print(colors.red .. "[Anticheat] Ошибка загрузки модуля " .. 
                  name .. ": " .. module .. colors.reset)
        end
    end

    -- Выводим логотип и информацию
    print(colors.cyan .. logo .. colors.reset)
    print(colors.yellow .. "Version: " .. config.version .. colors.reset)
    print(colors.yellow .. "Powered by Jastickon" .. colors.reset)
    
    -- Возвращаем статус загрузки
    return true
end

return Anticheat