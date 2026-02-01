log_debug("Запуск system/DataManager.lua")

local DataManager = {}
DataManager.base_folder = dir_server .. "Server/SubRPDate"
DataManager.subfolders = {"players", "vehicles", "jobs"}


function DataManager.log_success(message)
    log_success("Date | " .. message)
end

function DataManager.log_error(message)
    log_error("Date | " .. message)
end

function DataManager.format_json(data)
    return json.encode(data, { indent = true })
end

function DataManager.info_count(folder)
    local folders = DataManager.load_data("", "folders_list.json") or {}
    if folders[folder] then
        return #folders[folder]
    else
        return 0
    end
end

function DataManager.list_files(folder)
    local folders = DataManager.load_data("", "folders_list.json") or {}
    return folders[folder]
end



function DataManager.save_data(folder, filename, data)
    local path = DataManager.base_folder .. "/" .. folder .. "/" .. filename
    local file = io.open(path, "w")
    
    if file then
        file:write(DataManager.format_json(data))
        file:close()
        DataManager.log_success("Данные сохранены в: " .. path)
    else
        DataManager.log_error("Ошибка при сохранении данных в: " .. path)
    end
end

function DataManager.load_data(folder, filename)
    local path = DataManager.base_folder .. "/" .. folder .. "/" .. filename
    local file = io.open(path, "r")
    
    if file then
        local data = file:read("*a")
        file:close()
        return json.decode(data)
    else
        DataManager.log_error("Ошибка при загрузке данных из: " .. path)
        return nil
    end
end

function DataManager.update_data(folder, filename, new_data)
    local current_data = DataManager.load_data(folder, filename)
    
    if current_data then
        for key, value in pairs(new_data) do
            current_data[key] = value
        end
        
        DataManager.save_data(folder, filename, current_data)
    else
        DataManager.log_error("Невозможно обновить данные, так как файл не найден: " .. filename)
    end
end

return DataManager


-- -- Создаем данные о человеке
-- local player_data = {
--     id = 2,
--     name = "Иван",
--     age = 30
-- }
-- DataManager.save_data("players", "player1.json", player_data)


-- local new_player_data = {
--     age = 31 -- Изменяем только возраст
-- }
-- DataManager.update_data("players", "player1.json", new_player_data)



-- -- Создаем данные о машине
-- local vehicle_data = {
--     id = 1,
--     model = "Toyota",
--     year = 2020
-- }
-- DataManager.save_data("vehicles", "vehicle1.json", vehicle_data)

-- -- Читаем данные о человеке
-- local loaded_player = DataManager.load_data("players", "player1.json")
-- print("Загруженные данные о игроке:", loaded_player.name, loaded_player.age)



-- -- Читаем данные о машине
-- local loaded_vehicle = DataManager.load_data("vehicles", "vehicle1.json")
-- print("Загруженные данные о машине:", loaded_vehicle.model, loaded_vehicle.year)