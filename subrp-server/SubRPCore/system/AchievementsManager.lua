log_debug("Запуск system/AchievementsManager.lua")

local AchievementsConfig = DataManager.load_data("config", "achievements_config.json") or {}
local AchievementsManager = {}

function AchievementsManager.initPlayer(Nick)
    if DataManager.load_data("achievements", Nick .. ".json") == nil then
        local playerData = {
            unlocked = {},
            progress = {},
            lastCheck = os.time()
        }
        DataManager.save_data("achievements", Nick .. ".json", playerData)
    end
end

function AchievementsManager.resetPlayerAchievements(Nick)
    DataManager.save_data("achievements", Nick .. ".json", {
        unlocked = {},
        progress = {},
        lastCheck = os.time()
    })
    return true
end


function AchievementsManager.updateAchievementProgress(Nick, achievementType, value, statName)


    local playerData = DataManager.load_data("achievements", Nick .. ".json") or {
        unlocked = {},
        progress = {},
        lastCheck = os.time()
    }
    
    local updated = false
    
    for _, achievement in ipairs(AchievementsConfig) do
        local condition = achievement.condition
        if condition.type == achievementType and 
           (not statName or condition.statName == statName) then
            local achievementId = achievement.id
            
            if playerData.unlocked[achievementId] then goto continue end
            
            if not playerData.progress[achievementId] then
                playerData.progress[achievementId] = 0
            end
            
            local newProgress = playerData.progress[achievementId] + value
            playerData.progress[achievementId] = math.min(newProgress, condition.target)
            
            if playerData.progress[achievementId] >= condition.target then
                playerData.unlocked[achievementId] = os.time()
                playerData.progress[achievementId] = nil
            end
            
            updated = true
        end
        
        ::continue::
    end
    
    if updated then
        DataManager.save_data("achievements", Nick .. ".json", playerData)

        for user_id, nick in pairs(MP.GetPlayers()) do
            if nick == Nick then
                achievements = AchievementsManager.getPlayerAchievements(Nick)
                M.DataPlayer[user_id].hud.achievements= achievements
                send_data_hud(user_id)
            end
        end
    end
    
    return updated
end

function AchievementsManager.getPlayerAchievements(Nick)
    local playerData = DataManager.load_data("achievements", Nick .. ".json") or {
        unlocked = {},
        progress = {},
        lastCheck = os.time()
    }
    
    local result = {}
    
    for index, achievement in ipairs(AchievementsConfig) do
        local achievementId = achievement.id or tostring(index)
        local unlocked = playerData.unlocked and playerData.unlocked[achievementId] ~= nil
        local progress = playerData.progress and playerData.progress[achievementId] or 0
        
        local unlockDate = nil
        if unlocked and playerData.unlocked[achievementId] then
            unlockDate = os.date("%d.%m.%Y", playerData.unlocked[achievementId])
        end
        
        local progressInfo = nil
        if not unlocked and achievement.condition and achievement.condition.target then
            local target = tonumber(achievement.condition.target) or 1
            local current = tonumber(progress) or 0
            current = math.min(current, target)
            
            progressInfo = {
                current = current,
                total = target
            }
        end
        
        local reward = achievement.reward or {}
        local rewardInfo = {
            money = tonumber(reward.money) or 0,
            exp = tonumber(reward.exp) or 0,
            badge = reward.badge
        }
        
        table.insert(result, {
            id = index,
            title = achievement.title or "Без названия",
            description = achievement.description or "",
            icon = achievement.icon or "fa-trophy",
            reward = rewardInfo,
            unlocked = unlocked,
            unlockDate = unlockDate,
            progress = progressInfo,
            isGold = achievement.isGold or false
        })
    end
    
    return result
end

return AchievementsManager