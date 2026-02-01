log_debug("Запуск system/DataFraction.lua")


function getFraction(player_name)
    local user = DataManager.load_data("players", player_name .. ".json") or {}
    if DataManager.load_data("fractions", user.fraction_id .. ".json") then
        local fraction = DataManager.load_data("fractions", user.fraction_id .. ".json") or {}
        return fraction
    else
        local fraction = {
            name = "Отсутствует"
        }
        return fraction
    end
end