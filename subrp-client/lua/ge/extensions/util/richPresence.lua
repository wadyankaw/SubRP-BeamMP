local M = {}

M.state = { levelName = "", vehicleName = "" ,levelIdentifier=""}

local internal = not shipping_build or not string.match(beamng_windowtitle, "RELEASE")

local location = "Загрузка..."


local vehAssets = {"pickup"}
local lvlAssets = {
  "automation_test_track",
  "cliff",
  "derby",
  "driver_training",
  "east_coast_usa",
  "glow_city",
  "gridmap",
  "hirochi_raceway",
  "industrial",
  "italy",
  "jungle_rock_island",
  "small_island",
  "smallgrid",
  "utah",
  "west_coast_usa",
}

local function locationload(data)
  location = data
end

local function msgFormat()
  local fgActivityId = gameplay_missions_missionManager.getForegroundMissionId()
  local mission = gameplay_missions_missions.getMissionById(fgActivityId)

  M.set(location)
  if Discord and Discord.isWorking() then
    local dActivity = {
      state = "Играет на сервере SubRP Vanila",
      details = location,
      asset_largeimg = "https://i.imgur.com/HqkvygM.png",
      asset_largetxt = SubRPHud.getUserRich(),
      asset_smallimg = "https://i.imgur.com/xTFdJX8.png",
      asset_smalltxt = "@Subterrania Team"
    }

    if M.state.levelName ~= "" then
      dActivity.asset_largetxt = SubRPHud.getUserRich();
    end
    if M.state.vehicleName ~= "" then
      dActivity.asset_smalltxt = "@Subterrania Team ❤"
    end
    if M.state.levelIdentifier and M.state.levelIdentifier ~= "" and tableContains(lvlAssets,M.state.levelIdentifier)then
      dActivity.asset_largeimg= "https://i.imgur.com/HqkvygM.png"
    else
      dActivity.asset_largeimg="https://i.imgur.com/HqkvygM.png"
    end
    Discord.setActivity(dActivity)
  end
end

local function onExtensionLoaded()
  if not internal and settings.getValue('richPresence') then
    if Steam then
      Steam.setRichPresence('steam_display', '#BNGGSW')
      Steam.setRichPresence('status', beamng_windowtitle)
      Steam.setRichPresence('b', "   ")
    end
    if Discord then
      Discord.setEnabled(true)
    end
  end
end

local function onExtensionUnloaded()
  if Steam then
    Steam.setRichPresence('b', "   ")
  end
  if Discord then
    Discord.clearActivity()
  end
end

local function set(v)
  log("D","Rich Presence", tostring(v))
  if Steam then
    return Steam.setRichPresence('b', tostring(v))
  end
end

local toggleableFunctions = {
  set = set
}

local function enableToggleableFunctions(enabled)
  for k, v in pairs(toggleableFunctions) do
    M[k] = enabled and v or nop
  end
end

local function onSettingsChanged()
  if internal or not settings.getValue('richPresence') then
    if Steam then
      Steam.setRichPresence('b', "   ")
    end
    if Discord then
      Discord.setEnabled(true)
    end
    enableToggleableFunctions(false)
  elseif M.set == nop and settings.getValue('richPresence') then --re-enabled
    log("D","Rich Presence", "Rich Presence is enabled.")
    Steam.setRichPresence('steam_display', '#BNGGSW')
    Steam.setRichPresence('status', beamng_windowtitle)
    Steam.setRichPresence('b', "   ")
    enableToggleableFunctions(true)
    if Discord then
      Discord.setEnabled(true)
    end
    msgFormat()
  end
end

M.onExtensionLoaded = onExtensionLoaded
M.onExtensionUnloaded = onExtensionUnloaded
M.msgFormat = msgFormat
M.locationload = locationload
M.onSettingsChanged = onSettingsChanged
M.onAnyMissionChanged = onAnyMissionChanged
M.onDeserialized    = nop

if not internal then
  enableToggleableFunctions(true)
else
  enableToggleableFunctions(false)

  if Steam then
    Steam.setRichPresence('b', "   ")
  end
end

return M

