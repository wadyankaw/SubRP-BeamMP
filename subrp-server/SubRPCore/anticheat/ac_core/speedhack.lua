MP.CancelEventTimer("SecTimerSpeed", 1000)
MP.RegisterEvent("SecTimerSpeed", "checkSPEED")
MP.CreateEventTimer("SecTimerSpeed", 1000)

local speedhack = {
    name = "Anti-SpedHack",
}

WarnSpeed = 350         -- Максимальная разрешенная скорость (км/ч)
KickSpeed = 400         -- Скорость для автоматического кика
MaxAcceleration = 46    -- Максимальное разрешенное ускорение (км/ч/с)
WarnAcceleration = 40   -- Ускорение для предупреждения (км/ч/с)
MaxWarnings = 2         -- Максимальное количество предупреждений перед блокировкой

Players, PlayerCars, PlayerVelocities, PlayerSpeeds, PreviousSpeeds = {}, {}, {}, {}, {}
PlayerWarnings = {}

function Judge(speed, acceleration, playerID)
    if speed > KickSpeed then
        send_dc_message("1396162882357428436", {
                embed = {
                    title = "Античит",
                    description = "Кикнут. Подозрение на использования SpeedHack",
                    color = 0xFF0000,
                    fields = {
                        {name = "Ник", value = M.DataPlayer[playerID].nick , inline = true},
                        {name = "Скорость", value = speed.." км/ч", inline = true}
                    },
                    footer = {text = os.date("%H:%M:%S")}
                }
            })
        MP.DropPlayer(playerID, "[SubArmor] Подозрительная деятельность")
        return print("\27[31m Кик ".. playerID .. " (Скорость: "..speed.." км/ч)\27[0m")
    end
    
    if acceleration > MaxAcceleration then
        PlayerWarnings[playerID] = (PlayerWarnings[playerID] or 0) + 1

        if PlayerWarnings[playerID] >= MaxWarnings then
            MP.DropPlayer(playerID, "[SubArmor] Подозрительная деятельность")
            send_dc_message("1396162882357428436", {
                embed = {
                    title = "Античит",
                    description = "Кикнут. Подозрение на использования SpeedHack",
                    color = 0xFF0000,
                    fields = {
                        {name = "Ник", value = M.DataPlayer[playerID].nick , inline = true},
                        {name = "Ускорение", value = acceleration.." км/ч/с", inline = true}
                    },
                    footer = {text = os.date("%H:%M:%S")}
                }
            })
            return print("\27[31m Кик ".. MP.GetPlayerName(playerID) .. " за превышение ускорения (Ускорение: "..acceleration.." км/ч/с, Предупреждений: "..PlayerWarnings[playerID]..")\27[0m")
        else
            send_dc_message("1396162882357428436", {
                embed = {
                    title = "Античит",
                    description = "Подозрение на использования SpeedHack",
                    color = 0xFF0000,
                    fields = {
                        {name = "Ник", value = M.DataPlayer[playerID].nick , inline = true},
                        {name = "Ускорение", value = acceleration.." км/ч/с", inline = true}
                    },
                    footer = {text = os.date("%H:%M:%S")}
                }
            })
            return print("\27[31mПредупреждение ".. PlayerWarnings[playerID] .."/"..MaxWarnings.." для ".. MP.GetPlayerName(playerID) .. " (Ускорение: "..acceleration.." км/ч/с)\27[0m")
        end
    end
    
    if speed > WarnSpeed then
        return print("Подозрительная скорость у ".. playerID .. " (Скорость: "..speed.." км/ч)")
    end
    
    if acceleration > WarnAcceleration then
        send_dc_message("1396162882357428436", {
            embed = {
                title = "Античит",
                description = "Подозрение на использования SpeedHack",
                color = 0xFF0000,
                fields = {
                    {name = "Ник", value = M.DataPlayer[playerID].nick , inline = true},
                    {name = "Ускорение", value = acceleration.." км/ч/с", inline = true}
                },
                footer = {text = os.date("%H:%M:%S")}
            }
        })
        return print("Подозрительное ускорение у ".. playerID .. " (Ускорение: "..acceleration.." км/ч/с)")
    end
    
    if acceleration <= WarnAcceleration and PlayerWarnings[playerID] and PlayerWarnings[playerID] > 0 then
        PlayerWarnings[playerID] = 0
    end
end

function checkSPEED()
    local current_time = os.time()
    
    Players = MP.GetPlayers()

    for i, v in pairs(Players) do
        PlayerCars[i] = MP.GetPlayerVehicles(i)
        if not PlayerCars[i] then goto skipPlayer end

        for j, _ in pairs(PlayerCars) do
            if not PlayerVelocities[i] then 
                PlayerVelocities[i] = {} 
                PreviousSpeeds[i] = {}
            end

            if not MP.GetPositionRaw(i, j) then goto skipCar end

            PlayerVelocities[i][j] = MP.GetPositionRaw(i, j).vel

            if not PlayerSpeeds[i] then PlayerSpeeds[i] = {} end

            PlayerSpeeds[i][j] = math.floor(math.sqrt(PlayerVelocities[i][j][1]^2 + PlayerVelocities[i][j][2]^2 + PlayerVelocities[i][j][3]^2) * 3.6)
            
            local acceleration = 0
            if PreviousSpeeds[i][j] then
                acceleration = PlayerSpeeds[i][j] - PreviousSpeeds[i][j]
            end
            PreviousSpeeds[i][j] = PlayerSpeeds[i][j]

            Judge(PlayerSpeeds[i][j], acceleration, i)

            ::skipCar::
        end
        ::skipPlayer::
    end
end

speedhack.check = checkSPEED

return speedhack