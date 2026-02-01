log_debug("Запуск system/HudManager.lua")


MP.RegisterEvent("Triggerdeposit_money", "deposit_money")
MP.RegisterEvent("Triggerwithdraw_money", "withdraw_money")
MP.RegisterEvent("Triggerbutton_send_trans", "button_send_trans")
MP.RegisterEvent("Triggerbutton_pay_pdd", "button_pay_pdd")
MP.RegisterEvent("Triggerfast_use_button", "fast_use_button")
MP.RegisterEvent("TriggerSubRPPointUse", "SubRPPointUse")
MP.RegisterEvent("TriggerSubRPpayForFuel", "SubRPpayForFuel")
MP.RegisterEvent("TriggerSubRPChangeBuisnesRation", "ChangeBuisnesRation")
MP.RegisterEvent("TriggerSubRPChangeBuisnesStatus", "ChangeBuisnesStatus")
MP.RegisterEvent("TriggerSubRPChangeBuisnesAddBal", "ChangeBuisnesAddBal")
MP.RegisterEvent("TriggerSubRPChangeBuisnesRemBal", "ChangeBuisnesRemBal")
MP.RegisterEvent("TriggerSubRPbuy_buisnes", "buy_buisnes")



function buy_buisnes(user_id, data)
	local buisnes = DataManager.load_data("buisnes", M.DataPlayer[user_id].buy_buisnes .. ".json") or {}

	if buisnes.owner_id == -1 then
		local user = DataManager.load_data("players", M.DataPlayer[user_id].nick .. ".json") or {}
		if user.bank_bal >= buisnes.price then
			
			local update_data = {
				bank_bal = user.bank_bal - buisnes.price
			}
			DataManager.update_data("players", M.DataPlayer[user_id].nick .. ".json", update_data)


			local update_data = {
				owner_id = user.game_id,
				balance = 3000,
				mat = buisnes.mat_max
			}
			DataManager.update_data("buisnes", M.DataPlayer[user_id].buy_buisnes .. ".json", update_data)

			M.DataPlayer[user_id].hud.InfoPlayerBankMoney = user.bank_bal - buisnes.price
			local buisnes = {}
			for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
				local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
				
				if for_buisnes.owner_id == user.game_id then
					local buisnes_name = file_name:match("(.+)%..+$")
					buisnes[buisnes_name] = for_buisnes
				end
			end
			M.DataPlayer[user_id].hud.buisnes = buisnes
		
			send_data_hud(user_id)
			open_user_ui(user_id, "close_hud")
			send_notify(user_id, buisnes.buisnes_name, "Поздравляем!!! Вы купили бизнес", "success", 10000)
		else
			send_notify(user_id, buisnes.buisnes_name, "Недостаточно средств в банке", "error", 10000)
		end

	else
		send_notify(user_id, buisnes.buisnes_name, "Вы не можете купить этот бизнес", "error", 10000)
	end
end



function ChangeBuisnesAddBal(user_id, data_json)
	local data = json.decode(data_json) or {}
    local buisnes = DataManager.load_data("buisnes", data.businessId .. ".json") or {}
    if M.DataPlayer[user_id].game_id == buisnes.owner_id then
		local user = DataManager.load_data("players", M.DataPlayer[user_id].nick .. ".json") or {}
		if tonumber(buisnes.balance) > 0 then
			local update_data = {
				bank_bal = user.bank_bal + buisnes.balance
			}
			DataManager.update_data("players", M.DataPlayer[user_id].nick .. ".json", update_data)
			local buisnes = {}
			for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
				local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
				
				if for_buisnes.owner_id == M.DataPlayer[user_id].game_id then
					local buisnes_name = file_name:match("(.+)%..+$")
					buisnes[buisnes_name] = for_buisnes
				end
			end
			M.DataPlayer[user_id].hud.buisnes = buisnes
			send_data_hud(user_id)

			send_notify(user_id, "Бизнес", "Вы успешно сняли все деньги", "success", 4000)
		else
			send_notify(user_id, "Бизнес", "Недостаточно средств", "error", 10000)
		end
    end
end

function ChangeBuisnesAddBal(user_id, data_json)
	local data = json.decode(data_json) or {}
    local buisnes = DataManager.load_data("buisnes", data.businessId .. ".json") or {}
    if M.DataPlayer[user_id].game_id == buisnes.owner_id then
		local user = DataManager.load_data("players", M.DataPlayer[user_id].nick .. ".json") or {}
		if tonumber(user.bank_bal) >= 1000 then
			local update_data = {
				balance = buisnes.balance + 1000
			}
			DataManager.update_data("buisnes", data.businessId .. ".json", update_data)
			local buisnes = {}
			for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
				local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
				
				if for_buisnes.owner_id == M.DataPlayer[user_id].game_id then
					local buisnes_name = file_name:match("(.+)%..+$")
					buisnes[buisnes_name] = for_buisnes
				end
			end
			M.DataPlayer[user_id].hud.buisnes = buisnes
			send_data_hud(user_id)
			send_notify(user_id, "Бизнес", "Оплачено", "success", 4000)

		else
			send_notify(user_id, "Бизнес", "Недостаточно средств в банке", "error", 10000)
		end
    end
end

function ChangeBuisnesStatus(user_id, data_json)
    local data = json.decode(data_json) or {}
    local buisnes = DataManager.load_data("buisnes", data.businessId .. ".json") or {}
    if M.DataPlayer[user_id].game_id == buisnes.owner_id then
        local update_data = {
            open = data.status
        }
        DataManager.update_data("buisnes", data.businessId .. ".json", update_data)
		local buisnes = {}
		for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
			local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
			
			if for_buisnes.owner_id == M.DataPlayer[user_id].game_id then
				local buisnes_name = file_name:match("(.+)%..+$")
				buisnes[buisnes_name] = for_buisnes
			end
		end
		M.DataPlayer[user_id].hud.buisnes = buisnes
    end
end

function ChangeBuisnesRation(user_id, data_json)
    local data = json.decode(data_json) or {}
    local buisnes = DataManager.load_data("buisnes", data.businessId .. ".json") or {}
    if M.DataPlayer[user_id].game_id == buisnes.owner_id then
        local update_data = {
            ratio = data.newRatio
        }
        DataManager.update_data("buisnes", data.businessId .. ".json", update_data)
		local buisnes = {}
		for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
			local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
			
			if for_buisnes.owner_id == M.DataPlayer[user_id].game_id then
				local buisnes_name = file_name:match("(.+)%..+$")
				buisnes[buisnes_name] = for_buisnes
			end
		end
		M.DataPlayer[user_id].hud.buisnes = buisnes
		send_data_hud(user_id)
    end
end

function SubRPpayForFuel(user_id, data_json)
	local data = json.decode(data_json) or {}
    local user = DataManager.load_data("players", M.DataPlayer[user_id].nick .. ".json") or {}
	if data.type == "bank" then
		if tonumber(user.bank_bal) >= tonumber(data.value) then
			local data_user = {
				bank_bal = tostring(tonumber(user.bank_bal) - tonumber(data.value))
			}
			DataManager.update_data("players", M.DataPlayer[user_id].nick .. ".json", data_user)
			M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ "..tostring(tonumber(user.bank_bal) - tonumber(data.value))
			add_fuel_station(user_id, data.fuel)
			send_notify(user_id, "Заправка", "Оплачено, заправляем ".. data.fuel .. " литров", "success", 7000)

			local buisnes = DataManager.load_data("buisnes", M.DataPlayer[user_id].buisnes_id .. ".json") or {}
			if buisnes.owner_id ~= -1 then
				local new_mat = buisnes.mat - data.fuel
				if new_mat <= 0 then
                	new_mat = 0
            	end	


				if buisnes.mat >= new_mat then
					local current_day = os.date("%A")

					local current_profit = buisnes.last_days_profit[current_day] and buisnes.last_days_profit[current_day].profit or 0
					local updated_profit = current_profit + (tonumber(data.value) / 10)
					local new_balance = buisnes.balance + (tonumber(data.value) / 10)
					
					local updated_profits = {}
					for day, day_data in pairs(buisnes.last_days_profit or {}) do
						updated_profits[day] = { profit = day_data.profit }
					end
					updated_profits[current_day] = { profit = updated_profit }
					
					local data_new = {
						mat = new_mat,
						last_days_profit = updated_profits, 
						balance = new_balance
					}
					
					DataManager.update_data("buisnes", M.DataPlayer[user_id].buisnes_id .. ".json", data_new)
				end
			end

			send_data_hud(user_id)
		else
			send_notify(user_id, "Заправка", "Недостаточно средств", "error", 10000)
		end

	elseif data.type == "cash" then
		if tonumber(user.bal) >= tonumber(data.value) then
			local data_user = {
				bal = tostring(tonumber(user.bal) - tonumber(data.value))
			}
			DataManager.update_data("players", M.DataPlayer[user_id].nick .. ".json", data_user)
			M.DataPlayer[user_id].hud.InfoPlayerMoney = "$ "..tostring(tonumber(user.bal) - tonumber(data.value))
			add_fuel_station(user_id, data.fuel)
			send_notify(user_id, "Заправка", "Оплачено, заправляем ".. data.fuel .. " литров", "success", 7000)

			local buisnes = DataManager.load_data("buisnes", M.DataPlayer[user_id].buisnes_id .. ".json") or {}
			if buisnes.owner_id ~= -1 then
				local new_mat = buisnes.mat - data.fuel
				if buisnes.mat >= new_mat then
					local current_day = os.date("%A")

					local current_profit = buisnes.last_days_profit[current_day] and buisnes.last_days_profit[current_day].profit or 0
					local updated_profit = current_profit + tonumber(data.value) / 10
					local new_balance = buisnes.balance + (tonumber(data.value) / 10)
					
					local updated_profits = {}
					for day, day_data in pairs(buisnes.last_days_profit or {}) do
						updated_profits[day] = { profit = day_data.profit }
					end
					updated_profits[current_day] = { profit = updated_profit }
					
					local data_new = {
						mat = new_mat,
						last_days_profit = updated_profits, 
						balance = new_balance
					}
					
					DataManager.update_data("buisnes", M.DataPlayer[user_id].buisnes_id .. ".json", data_new)
				end
			end

			send_data_hud(user_id)
		else
			send_notify(user_id, "Заправка", "Недостаточно средств", "error", 10000)
		end
	end
end

function SubRPPointUse(user_id, data_json)
	local data = json.decode(data_json) or {}
	local colonPos = data.identifier:find(":")
	local buisnes_name = data.identifier:sub(1, colonPos - 1)
	local buisnes_id = data.identifier:match(":(%w+)_?") or data.identifier:match(":(%w+)")
	M.DataPlayer[user_id].buisnes_id = buisnes_id

	if buisnes_name == "buisnes_buy" then
		local buisnes = DataManager.load_data("buisnes", buisnes_id .. ".json") or {}
		if buisnes.owner_id == -1 then
			M.DataPlayer[user_id].buy_buisnes = buisnes_id
			local data = {
				buisnes_name = buisnes.buisnes_name,
				name = buisnes.name, 
				pay_day = buisnes.pay_day,
				price = buisnes.price
			}
			M.DataPlayer[user_id].hud.buy_biz = data
			send_data_hud(user_id)
			open_user_ui(user_id, "ui-buy_biz")
		else
			send_notify(user_id, buisnes.buisnes_name, "Вы не можете купить этот бизнес", "error", 10000)
		end

	elseif buisnes_name == "start_work" then
		if buisnes_id == "work_bus" then
			open_user_ui(user_id, "ui-jobs-bus")
		elseif buisnes_id == "work_taxi" then
			load_taxi(user_id)
		end



	elseif buisnes_name == "cardealership" then
		local config_car_sell = DataManager.load_data("config", "sell_cars.json")
		local buisnes = DataManager.load_data("buisnes", buisnes_id .. ".json") or {}
		if buisnes.open == false then
			send_notify(user_id, "Автосалон", "К сожалению автосалон закрыт", "error", 10000)
			return
		end

		function adjustPrices(cfg, coefficient)
			for _, car in ipairs(cfg) do
				car.price = math.floor(car.price * coefficient)
			end
			return cfg
		end
		
		local coefficient = buisnes.ratio
		local updatedConfig = adjustPrices(config_car_sell, coefficient)
		M.DataPlayer[user_id].hud.diler_cars = updatedConfig
		M.DataPlayer[user_id].hud.diler_name = buisnes.name
		send_data_hud(user_id)
		open_user_ui(user_id, "ui-car_diler")

	elseif buisnes_name == "fuelstations" then
		local buisnes = DataManager.load_data("buisnes", buisnes_id .. ".json") or {}
		if buisnes.open == false then
			send_notify(user_id, "Заправка", "К сожалению заправка закрыта", "error", 10000)
			return
		end

		price_fuel = {}
		for fuel_type, price in pairs(buisnes.price_fuel) do
			price_fuel[fuel_type] = price * buisnes.ratio
		end
		M.DataPlayer[user_id].hud.fuelPricePerLiter = price_fuel

		M.DataPlayer[user_id].hud.fuel_station_name = buisnes.name
		M.DataPlayer[user_id].hud.vehicle= {
			model = "ETK 800",
			currentFuel = M.DataPlayer[user_id].FuelData.current,
			fuelCapacity = M.DataPlayer[user_id].FuelData.capacity,
			typeFuel = M.DataPlayer[user_id].FuelData.fuelType
		}
		send_data_hud(user_id)
		open_user_ui(user_id, "ui-gas-station")
	end
end

function open_user_ui(user_id, ui_id)
    MP.TriggerClientEvent(user_id, "ClientEventHudOpenUI", ui_id);
end

function fast_use_button(data_json)
	local data = json.decode(data_json)
	log_debug(data.button_id)
	log_debug(data.nick)
end

function withdraw_money(user_id, value)
	local player_name = M.DataPlayer[user_id].nick
    local user = DataManager.load_data("players", player_name .. ".json")
	if tonumber(user.bank_bal) >= tonumber(value) then

		local player_data ={
			bank_bal = tostring(tonumber(user.bank_bal) - tonumber(value)),
			bal = tostring(tonumber(user.bal) + tonumber(value))
		}
		DataManager.update_data("players", player_name..".json", player_data)
		send_notify(user_id, "Банк", "Вы успешно сняли деньги", "success", 10000)
		M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ "..tostring(tonumber(user.bank_bal) - tonumber(value))
		M.DataPlayer[user_id].hud.InfoPlayerMoney = tostring(tonumber(user.bal) + tonumber(value))
		send_data_hud(user_id)
		open_user_ui(user_id, "close_hud")
	else
		send_notify(user_id, "Банк", "Недостаточно средств в банке", "error", 10000)
	end
end

function deposit_money(user_id, value)
	local player_name = M.DataPlayer[user_id].nick
    local user = DataManager.load_data("players", player_name .. ".json")
	if tonumber(user.bal) >= tonumber(value) then

		local player_data ={
			bank_bal = tostring(tonumber(user.bank_bal) + tonumber(value)),
			bal = tostring(tonumber(user.bal) - tonumber(value))
		}
		DataManager.update_data("players", player_name..".json", player_data)
		send_notify(user_id, "Банк", "Вы успешно полнили баланс", "success", 10000)
		M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ "..tostring(tonumber(user.bank_bal) + tonumber(value))
		M.DataPlayer[user_id].hud.InfoPlayerMoney = tostring(tonumber(user.bal) - tonumber(value))
		send_data_hud(user_id)
		open_user_ui(user_id, "close_hud")
	else
		send_notify(user_id, "Банк", "Недостаточно наличных", "error", 10000)
	end
end

function button_send_trans(user_id, data_json)
	local data = json.decode(data_json)
	local amount = data.amount
	local sendId = data.sendId
	local player_name = M.DataPlayer[user_id].nick
    local user = DataManager.load_data("players", player_name .. ".json")
	local trans_user = nil

	for _ , file_name in ipairs(DataManager.list_files("players")) do
		local for_trans_user = DataManager.load_data("players", file_name)
		
		if for_trans_user.bank_card_number == sendId then
			if for_trans_user.nick == player_name then
				send_notify(user_id, "Банк", "Запрещён перевод самому себе", "error", 10000)
				return
			end


			trans_user = for_trans_user
			
		end
	end
	if trans_user == nil then
		send_notify(user_id, "Банк", "Не найден номер карты ".. sendId, "error", 10000)
		return
	end


	if tonumber(user.bank_bal) >=  tonumber(amount) then
		local new_bal =  tostring(tonumber(user.bank_bal) - tonumber(amount))
		local player_data ={
			bank_bal = new_bal
		}
		DataManager.update_data("players", player_name..".json", player_data)

		M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ "..new_bal
		send_data_hud(user_id)
		

		local new_bal =  tostring(tonumber(trans_user.bank_bal) + tonumber(amount))
		local player_data ={
			bank_bal = new_bal
		}
		DataManager.update_data("players", trans_user.nick ..".json", player_data)

		for user_id, nick in pairs(MP.GetPlayers()) do
			if trans_user.nick == nick then
				M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ "..new_bal
				send_data_hud(user_id)
			end
		end
		
	else
		send_notify(user_id, "Банк", "Недостаточно средств", "error", 10000)
	end
end


function button_pay_pdd(user_id, data)
	local player_name = M.DataPlayer[user_id].nick
    local user = DataManager.load_data("players", player_name .. ".json")
	if tonumber(data) >= 0 then
		local order = M.DataPlayer[user_id].hud.PayPDD_info[data + 1]
		if tonumber(user.bank_bal) >= tonumber(order.amount) then

			table.remove(M.DataPlayer[user_id].hud.PayPDD_info, data + 1)
			local player_data ={
				bank_bal = tonumber(user.bank_bal) - tonumber(order.amount),
				orders_pdd = M.DataPlayer[user_id].hud.PayPDD_info
			}
			DataManager.update_data("players", player_name..".json", player_data)


			M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ ".. tonumber(user.bank_bal) - tonumber(order.amount)
			send_data_hud(user_id)
			log_success("Штраф оплачен")
			send_notify(user_id, "Банк", "Вы оплатили штраф", "success", 10000)
		else
			send_notify(user_id, "Банк", "Недостаточно средств", "error", 10000)
			log_error("Недостаточно средств")
		end
	elseif tonumber(data) == -1 then
		local full_amount = 0
		for _, entry in ipairs(M.DataPlayer[user_id].hud.PayPDD_info) do
			full_amount = full_amount + tonumber(entry.amount)
		end
		if tonumber(user.bank_bal) >= tonumber(full_amount) then

			M.DataPlayer[user_id].hud.PayPDD_info = {}

			local player_data ={
				orders_pdd = {},
				bank_bal = tonumber(user.bank_bal) - tonumber(full_amount)
			}
			DataManager.update_data("players", player_name..".json", player_data)
			M.DataPlayer[user_id].hud.InfoPlayerBankMoney = "$ ".. tonumber(user.bank_bal) - tonumber(full_amount)
			send_data_hud(user_id)
			log_success("Все штрафы оплачен")
			send_notify(user_id, "Банк", "Все штрафы оплачены", "success", 10000)
		else
			send_notify(user_id, "Банк", "Недостаточно средств", "error", 10000)
			log_error("Недостаточно средств")
		end

	end
end




function getUserAppJson()
	
	local UserAppJson = {
		["filename"] = "settings/ui_apps/layouts/default/multiplayerroleplay.uilayout.json", 
		["apps"] = {
			{ ["appName"] = "forcedInduction",
			  ["placement"] = {
				["width"] = "150px",
				["bottom"] = "320px",
				["height"] = "150px",
				["right"] = "20px"
			  },
			  ["settings"] = {
				["noCockpit"] = true
			  }
			},
			{ ["appName"] = "keyList",
			  ["placement"] = {
				["width"] = "355px",
				["height"] = "500px",
				["right"] = "0px",
				["top"] = "0px"
			  }
			},
			{ ["appName"] = "damageApp",
			  ["placement"] = {
				["bottom"] = "0px",
				["height"] = "300px",
				["left"] = "0px",
				["position"] = "absolute",
				["right"] = "",
				["top"] = "",
				["width"] = "168.75px"
			  }
			},
			{ ["appName"] = "tacho2",
			  ["placement"] = {
				["width"] = "300px",
				["bottom"] = "5px",
				["height"] = "300px",
				["right"] = "5px"
			  },
			  ["settings"] = {
				["noCockpit"] = true
			  }
			},
			{ ["appName"] = "messages",
			  ["placement"] = {
				["bottom"] = "",
				["height"] = "450px",
				["left"] = "0px",
				["position"] = "absolute",
				["right"] = "",
				["top"] = "0px",
				["width"] = "470px"
			  }
			},
            {
              ["appName"] = "roleplayhud",
              ["placement"] = {
                ["bottom"] = 0,
                ["left"] = 0,
                ["margin"] = "auto",
                ["position"] = "absolute",
                ["right"] = 0,
                ["top"] = 0
              }
            },
            { ["appName"] = "multiplayerchat",
			  ["placement"] = {
				["width"] = "550px",
				["bottom"] = "0px",
				["height"] = "170px",
				["left"] = "180px"
			  }
			},
			{ ["appName"] = "simplePowertrainControl",
			  ["placement"] = {
				["bottom"] = "0px",
				["height"] = "170px",
				["position"] = "absolute",
				["right"] = "260px",
				["width"] = "230px"
			  },
			  ["settings"] = {
				["noCockpit"] = true
			  }
			}
		},
		["title"] = "Multiplayer SubRP Hud",
		["type"] = "multiplayerroleplay"
	}
	
	return UserAppJson;
end;




function timer_minute()
    local currentTime = os.time()
    local seconds = os.date("*t", currentTime).sec
    local seconds = 60 - seconds
    for i = seconds, 1, -1 do
        MP.Sleep(1000)
    end

    log_debug("Установлен цикл на 1 минуту")
    MP.RegisterEvent("timer_minute", "update_hud_time")
    MP.CreateEventTimer("timer_minute", 1000 * 60 )
	MP.CreateEventTimer("timer_minute_place", 1000 * 60 )
end

local function getCurrentServerTime()
	
    local currentTime = os.date("*t")
    local formattedTime = string.format("%02d:%02d", currentTime.hour, currentTime.min)
    local formattedDate = string.format("%02d.%02d.%04d", currentTime.day, currentTime.month, currentTime.year)
    
    return formattedTime, formattedDate
end


function send_notify(user_id, name, title, type, time)
	local data = {
		name = name,
		title = title,
		type = type,
		time = time
	}
	local data_json = json.encode(data);
	MP.TriggerClientEvent(user_id, "ClientRunUINotify", data_json);
end

function update_hud_time()
	ip_count = {}
	ip_list = {}

	PlayerSyncData()
    local getInfoServerTime, getInfoServerDate = getCurrentServerTime()
    local config_level = DataManager.load_data("config", "level_config.json") or {}
    
    for user_id, nick in pairs(MP.GetPlayers()) do
        if not M.DataPlayer[user_id] or not M.DataPlayer[user_id].hud then
            goto continue
        end
        
        local user = DataManager.load_data("players", nick .. ".json")
        if not user then goto continue end
        
        local new_game_time = user.game_time + 1
        local data_update = {
            game_time = new_game_time,
            exp = user.exp + 1
        }
        DataManager.update_data("players", nick .. ".json", data_update)
        
        local hours_played = math.floor(new_game_time / 60)
        local previous_hours = math.floor(user.game_time / 60)
        if hours_played > previous_hours then
            AchievementsManager.updateAchievementProgress(nick, "playtime", 1)
        end
        
        local current_level = user.lvl
        local current_exp = user.exp + 1
        for _, entry in ipairs(config_level) do
            if entry.lvl == current_level then
                if entry.exp ~= -1 and current_exp >= entry.exp then
                    AchievementsManager.updateAchievementProgress(nick, "level", 1)
                    
                    local level_up_data = {
                        exp = current_exp - entry.exp,
                        lvl = current_level + 1
                    }
                    DataManager.update_data("players", nick .. ".json", level_up_data)
                    M.DataPlayer[user_id].hud.user_level = current_level + 1
                    send_notify(user_id, "Прокачка", "Вы получили новый уровень!!!", "success", 7000)
                end
                break
            end
        end
        
        local requiredExpForNextLevel = 0
        for _, levelEntry in ipairs(config_level) do
            if levelEntry.lvl == user.lvl then
                requiredExpForNextLevel = levelEntry.exp
                break
            end
        end
        local buisnes = {}
        for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
            local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
            if for_buisnes.owner_id == user.game_id then
                local buisnes_name = file_name:match("(.+)%..+$")
                buisnes[buisnes_name] = for_buisnes
            end
        end
        
        M.DataPlayer[user_id].hud.buisnes = buisnes
        M.DataPlayer[user_id].hud.levelProgress = requiredExpForNextLevel > 0 
            and math.floor((tonumber(user.exp) / tonumber(requiredExpForNextLevel)) * 100) 
            or 100
        M.DataPlayer[user_id].hud.playTime = new_game_time
        M.DataPlayer[user_id].hud.InfoServerTime = getInfoServerTime
        M.DataPlayer[user_id].hud.InfoServerDate = getInfoServerDate
        send_data_hud(user_id)
		
        
        ::continue::
    end
end

function update_hud_online()
    local players = MP.GetPlayers()
    local server_online = #players
    
    for user_id, nick in pairs(players) do
        if M.DataPlayer[user_id] and M.DataPlayer[user_id].hud then
            M.DataPlayer[user_id].hud.logoServerOnline = server_online
            send_data_hud(user_id)
        end
    end
end

function load_user_data(user_id)
    local server_online = 0
    for user_id, nick in pairs(MP.GetPlayers()) do
        server_online = server_online + 1
    end

    local getInfoServerTime, getInfoServerDate = getCurrentServerTime()
    local player_name = M.DataPlayer[user_id].nick
    local user = DataManager.load_data("players", player_name .. ".json") or {}
	local config_map_locations = DataManager.load_data("config", "map_locations.json")

	local levelConfig = DataManager.load_data("config", "level_config.json") or {}
	requiredExpForNextLevel = 0
	local config_car_sell = DataManager.load_data("config", "sell_cars.json")
	for _, levelEntry in ipairs(levelConfig) do
		
		if levelEntry.lvl == user.lvl then
			requiredExpForNextLevel = levelEntry.exp
			break
		end
	end

	local buisnes = {}
	for _ , file_name in ipairs(DataManager.list_files("buisnes")) do
		local for_buisnes = DataManager.load_data("buisnes", file_name) or {}
		
		if for_buisnes.owner_id == user.game_id then
			local buisnes_name = file_name:match("(.+)%..+$")
			buisnes[buisnes_name] = for_buisnes
		end
	end


    M.DataPlayer[user_id].hud = {
		buisnes = buisnes,
        InfoPlayerBankMoney = "$ "..user.bank_bal,
        InfoPlayerBankCardID = user.bank_card_number,
        InfoPlayerMoney = user.bal,
		nick = player_name,
		user_level = user.lvl,
		playTime = user.game_time,
		registrationDate = user.create_date,
		levelProgress = math.floor((tonumber(user.exp) / tonumber(requiredExpForNextLevel)) * 100),
		fraction_name = getFraction(player_name).name,
		name = M.DataPlayer[user_id].rp_name,
        InfoServerTime = getInfoServerTime,
        InfoServerDate = getInfoServerDate,
		PayPDD_info = user.orders_pdd,
        crossingRoad = "Loading",
        logoPlayerInfo = "[".. user.game_id .."]",
        logoServerOnline = server_online,
		map_locations = config_map_locations,
        Inventory_use = "Loading",
        Inventory_use_max = "Loading",
		fast_use_count = 3,
		diler_name = "Loading...",
		diler_cars = config_car_sell,
		fast_use = {
			{ id = 'trade', text = '🎁 Предложить обмен' },
			{ id = 'give-pass', text = '🧧 Показать документы' },
			{ id = 'fraction', text = '👬 Фракция' }
		},
        transactions = {
            { name = "Оплата за услуги", amount = "+500 $", color = "green" },
            { name = "Покупка автомобиля", amount = "-3500 $", color = "red" },
            { name = "Перевод другу", amount = "-200 $", color = "red" },
        },
		jobs = {
			bus = DataManager.load_data("jobs", "bus.json") or {},
			taxi = {}
		},
		achievements = AchievementsManager.getPlayerAchievements(player_name),
		work_status = {
			activi = false,
			name = "Loading",
			pay = "loading",
		}

    }
end

function send_data_hud(user_id)
	M.DataPlayer[user_id].ui_apps_set = getUserAppJson()
    local sanitized_hud = {}
    for k, v in pairs(M.DataPlayer[user_id].hud) do
        if type(k) == "number" then
            sanitized_hud[tostring(k)] = v
        else
            sanitized_hud[k] = v
        end
    end
    
    local success, data_json = pcall(json.encode, sanitized_hud)
    if not success then
        print("Failed to encode HUD data:", data_json)
        return
    end
    
    MP.TriggerClientEvent(user_id, "ClientEventUpdateHudData", data_json)
end