**🇷🇺 [Русский](README.md)** | **🇬🇧 [English](README_EN.md)**

---

# SubRP - RolePlay Mod for BeamMP

> **⚠️ CRITICAL WARNING**: 
> 
> **VIEWING CODE IS VERY DANGEROUS!** 
> 
> All code is written by a **top middle senior developer in Lua + BeamMP API**.  
> This is a leak of super secret development by **@Jastickon** for an RP project in BeamMP.  
> 
> **All code was created using DeepSeek and free ChatGPT.**
> 
> Plugin is developed for **BeamNG.drive version 0.36**.
> 
> All rights are **NOT protected**. Attempting to use without the creator's consent will **NOT** be prosecuted by law!
> 
> **P.S.**: Code quality speaks for itself - you can see it was written by a "top middle senior" who doesn't even know the difference between `==` and `=`, and comments in the code like "works, don't touch" - this is absolute garbage!
> 
> **Selected code gems:**
> - DDoS protection via IP counter - if more than 3 connections, it's definitely DDoS
> - Refactoring? Why bother, when you can just add another `if`
> - Global variables everywhere possible - why use locals when you can use globals?

Mod for BeamNG.drive with extended RolePlay support through BeamMP protocol. Full-featured system for creating an RP server with economy, businesses, jobs, factions, and achievements.

## Architecture

The project is organized on the principle of **client-server architecture** with clear separation of responsibilities:

### Structure Levels

```
SubRP/
│
├── subrp-client/                          # Client-side mod
│   ├── lua/                                # Lua scripts
│   │   ├── ge/                             # Game Engine extensions
│   │   │   └── extensions/
│   │   │       ├── SubRPCore.lua           # Main client module
│   │   │       ├── SubRPHud.lua            # HUD interface module
│   │   │       └── util/
│   │   │           └── richPresence.lua    # Discord/Steam Rich Presence
│   │   │
│   │   └── vehicle/                        # Vehicle extensions
│   │       └── extensions/
│   │           └── auto/
│   │               └── VSubRPCore.lua       # Vehicle synchronization
│   │
│   ├── scripts/                            # Loading scripts
│   │   ├── SubRPCore/
│   │   │   └── modScript.lua               # SubRPCore loader
│   │   └── SubRPHud/
│   │       └── modScript.lua               # SubRPHud loader
│   │
│   └── ui/                                  # User interface
│       └── modules/
│           ├── apps/
│           │   └── HudRP/                  # Main HUD application
│           │       ├── app.html             # HTML interface
│           │       ├── app.js               # JavaScript logic
│           │       ├── style.css            # Interface styles
│           │       ├── images/              # Images (logos, icons)
│           │       ├── sounds/              # Sound effects
│           │       └── fonts/               # Fonts
│           └── loading/                     # Loading screen
│
└── subrp-server/                            # Server-side mod
    └── SubRPCore/                           # Main server module
        ├── main.lua                         # Server entry point
        ├── system/                          # System modules
        │   ├── DataManager.lua              # Data management (CRUD)
        │   ├── DataPlayer.lua               # Player management
        │   ├── DataVehicle.lua              # Vehicle management
        │   ├── DataWorking.lua              # Job system
        │   ├── DataFraction.lua             # Faction management
        │   ├── HudManager.lua               # HUD data management
        │   ├── AchievementsManager.lua       # Achievements system
        │   ├── ApiEngine.lua                # API engine
        │   ├── CameraTrap.lua               # Speed traps (radars)
        │   ├── Commands.lua                 # Command system
        │   ├── MapData.lua                  # Map data
        │   └── TriggerData.lua              # Trigger data
        │
        ├── anticheat/                       # Anticheat system
        │   ├── main.lua                     # Main anticheat module
        │   ├── ac_core/
        │   │   ├── speedhack.lua            # Speed hack protection
        │   │   └── teleport.lua             # Teleport protection
        │   └── lib/
        │       └── logger.lua               # Anticheat logging
        │
        └── libs/                             # Libraries
            ├── logger.lua                   # Logging system
            ├── math.lua                     # Math functions
            ├── start.lua                    # Initialization
            ├── toml.lua                     # TOML parser
            └── ddos_protection.lua          # DDoS protection
```

### Architecture Principles

- **Client-server separation**: all business logic on server, client only displays
- **Modularity**: components organized into independent modules
- **Extensibility**: support for optional components and extensions
- **Security**: built-in anticheat system and DDoS protection

### Data Flow

```
Client (BeamMP) → Server (SubRPCore) → DataManager → JSON files
                ↓
            HudManager → Client (UI update)
```

1. **Client**: sends events via `TriggerServerEvent`
2. **Server**: processes events in corresponding modules
3. **DataManager**: saves/loads data to JSON files
4. **HudManager**: updates HUD data for client
5. **UI**: displays updated data to player

## Main Modules

### Client Modules

#### `SubRPCore.lua` - Main Client Module
**Purpose**: Processing game events on client, synchronization with server

**Main Functions**:
- `getPlayerVehicle()` - get player vehicle
- `set_fuel(data_json)` - set fuel level
- `add_fuel_station(data_json)` - refuel at gas station
- `use_button()` - use interaction points
- `VehSpawnPos(data)` - spawn vehicle
- `create_trigger_pos(data_json)` - create triggers
- `onSpeedTrapTriggered()` - handle speed traps
- `onRedLightCamTriggered()` - handle red light cameras
- `load_points()` - render interaction points
- `RenderUsersNick()` - render player nicknames

**Features**:
- Vehicle fuel management
- Interaction point system (gas stations, dealerships, businesses)
- Point visualization on map
- License plate synchronization
- Player nickname rendering with distance consideration

#### `SubRPHud.lua` - HUD Interface Module
**Purpose**: User interface management

**Main Functions**:
- `UpdateHudData(data_json)` - update HUD data
- `UpdateMapLocation()` - update current location
- `start_job_bus(route)` - start bus driver job
- `stop_job()` - stop job
- `buy_car_diler(jbeam, color)` - buy vehicle
- `open_close_fast_use()` - quick interaction with players
- `RunUINotify(data_json)` - send notifications
- `RunUISound(name, volume)` - play sounds

**Features**:
- Automatic nearest location detection
- Discord Rich Presence integration
- Notification system
- Quick player interaction

#### `VSubRPCore.lua` - Vehicle Extension
**Purpose**: Vehicle data synchronization

**Main Functions**:
- `sendFuel()` - send fuel data
- `sendDamage()` - send damage data

**Features**:
- Fuel level monitoring
- Vehicle damage tracking

#### `richPresence.lua` - Rich Presence
**Purpose**: Discord/Steam integration for status display

**Features**:
- Current location display
- Player information display
- Custom images for maps

### Server Modules

#### `DataManager.lua` - Data Management
**Purpose**: CRUD operations with JSON data files

**Main Functions**:
- `save_data(folder, filename, data)` - save data
- `load_data(folder, filename)` - load data
- `update_data(folder, filename, new_data)` - update data
- `list_files(folder)` - list files in folder
- `info_count(folder)` - file count

**Data Structure**:
- `players/` - player data
- `vehicles/` - vehicle data
- `buisnes/` - business data
- `jobs/` - job configuration
- `config/` - configuration files
- `api/` - API data
- `register/` - registration data

#### `DataPlayer.lua` - Player Management
**Purpose**: Handle player connection/disconnection, data management

**Main Functions**:
- `PlayerAuth()` - player authorization
- `PlayerJoining()` - connection process
- `PlayerJoin()` - successful connection
- `PlayerDisconnect()` - player disconnection
- `PlayerSyncData()` - player data synchronization
- `SetConfigPerm()` - set access permissions

**Features**:
- Discord registration system
- Protection against multiple connections from same IP
- Automatic profile creation on first registration
- Access permission system (user, test, admin)
- Unique player ID generation
- Bank card creation

#### `DataVehicle.lua` - Vehicle Management
**Purpose**: Player vehicle management

**Main Functions**:
- `buy_car_diler()` - buy vehicle at dealership
- `gen_place_number()` - generate license plate
- `spawn_owned_vehicle()` - spawn player vehicle
- `FuelData()` - handle fuel data
- `update_place_vehicle()` - update license plates

**Features**:
- Russian license plate generation
- Vehicle ownership system
- Business integration (dealerships)
- Fuel tracking

#### `DataWorking.lua` - Job System
**Purpose**: Player job management

**Main Functions**:
- `start_job_bus()` - start bus driver job
- `start_job_taxi()` - start taxi driver job
- `stop_work()` - stop job
- `load_taxi()` - load taxi data
- `getRandCheck()` - get random checkpoint

**Features**:
- Bus route system
- Taxi level system
- Checkpoints and rewards
- Work vehicle spawning

#### `HudManager.lua` - HUD Management
**Purpose**: HUD interface data management

**Main Functions**:
- `send_data_hud(user_id)` - send HUD data to client
- `load_user_data(user_id)` - load player data for HUD
- `update_hud_time()` - update time and statistics
- `update_hud_online()` - update server online count
- `send_notify()` - send notifications
- `open_user_ui()` - open UI interfaces

**Business Management**:
- `buy_buisnes()` - buy business
- `ChangeBuisnesAddBal()` - add business balance
- `ChangeBuisnesRemBal()` - withdraw business money
- `ChangeBuisnesStatus()` - change business status
- `ChangeBuisnesRation()` - change price coefficient

**Financial Operations**:
- `deposit_money()` - deposit to bank account
- `withdraw_money()` - withdraw from account
- `button_send_trans()` - transfer money between players
- `button_pay_pdd()` - pay traffic fines
- `SubRPpayForFuel()` - pay for fuel

**Interaction Points**:
- `SubRPPointUse()` - handle point usage
  - Gas stations (fuelstations)
  - Dealerships (cardealership)
  - Businesses (buisnes_buy)
  - Jobs (start_work)

**Features**:
- Level and experience system
- Game time tracking
- Business management
- Banking system
- Traffic fine system

#### `AchievementsManager.lua` - Achievements System
**Purpose**: Player achievements management

**Features**:
- Achievement progress tracking
- Completion rewards
- Level system integration

#### `ApiEngine.lua` - API Engine
**Purpose**: Provide API for external systems

**Features**:
- API for player list
- Server status API
- Discord integration

#### `CameraTrap.lua` - Speed Traps
**Purpose**: Camera system for speed and traffic law control

**Features**:
- Speed control cameras
- Red light cameras
- Automatic fine application
- License plate tracking

#### `Commands.lua` - Command System
**Purpose**: Server administrative commands

**Features**:
- Administrator commands
- Player management
- Server management

#### `DataFraction.lua` - Faction Management
**Purpose**: Faction system (police, medics, etc.)

**Features**:
- Faction member management
- Rank system
- Faction access permissions

#### `MapData.lua` - Map Data
**Purpose**: Map data management

**Features**:
- Map locations
- Points of interest
- Markers

#### `TriggerData.lua` - Trigger Data
**Purpose**: Map trigger management

**Features**:
- Trigger creation
- Trigger event handling
- Client synchronization

### Anticheat System

#### `anticheat/main.lua` - Main Module
**Purpose**: Anticheat coordination

#### `anticheat/ac_core/speedhack.lua` - Speed Hack Protection
**Purpose**: Detect and prevent speed hacks

#### `anticheat/ac_core/teleport.lua` - Teleport Protection
**Purpose**: Detect and prevent teleports

### UI Modules

#### `HudRP/app.html` - HTML Interface
**Purpose**: HUD interface structure

**Components**:
- Player information (money, bank, level)
- Mini-map with locations
- Online player list
- Notifications
- Interaction interfaces (gas station, dealership, businesses)

#### `HudRP/app.js` - JavaScript Logic
**Purpose**: UI interface logic

**Features**:
- Server event handling
- Real-time data updates
- Sound effects
- Animations

#### `HudRP/style.css` - Interface Styles
**Purpose**: Visual interface design

## Dependencies

- **BeamNG.drive** version **0.36** (plugin developed for this version)
- **BeamMP** server and client
- **Lua** (built into BeamNG.drive)
- **Node.js** (for server-side, if required)

## Installation

### Client Installation

1. Copy the `subrp-client` folder to BeamNG.drive mods directory:
   ```
   <BeamNG.drive>/mods/subrp-client/
   ```

2. Ensure file structure is preserved

3. Launch BeamNG.drive - mod will load automatically

### Server Installation

1. Copy the `subrp-server` folder to BeamMP Resources directory:
   ```
   <BeamMP Server>/Resources/subrp-server/
   ```

2. Add resource to `ServerConfig.toml`:
   ```toml
   [Resources]
   SubRPCore = "subrp-server/SubRPCore"
   ```

3. Create necessary data folders:
   ```
   SubRPDate/
   ├── players/
   ├── vehicles/
   ├── buisnes/
   ├── jobs/
   ├── config/
   ├── api/
   ├── register/
   └── fractions/
   ```

4. Configure files in `SubRPDate/config/`

5. Restart BeamMP server

## Usage

### Connecting to Server

1. Launch BeamNG.drive
2. Connect to BeamMP server with SubRP installed
3. Complete registration (if required)
4. Start playing in RP mode

### Main Features

#### Economy
- **Money**: cash and bank account
- **Bank**: deposit, withdraw, transfers
- **Businesses**: purchase, management, profit
- **Jobs**: earn money through work

#### Vehicles
- **Purchase**: buy vehicles at dealerships
- **Plates**: automatic Russian license plate generation
- **Fuel**: gas station refueling system
- **Damage**: vehicle condition tracking

#### Jobs
- **Bus**: bus driver job with routes
- **Taxi**: taxi driver job with level system
- **Cargo**: truck driver job

#### Businesses
- **Purchase**: buy businesses
- **Management**: open/close, change prices
- **Profit**: automatic profit calculation
- **Materials**: inventory management

#### Factions
- **Police**: patrolling, fines
- **Medics**: player treatment
- **Others**: extensible faction system

#### Achievements
- **Progress**: achievement tracking
- **Rewards**: completion rewards
- **Statistics**: game time, level tracking

## Configuration

### Server Settings

Main settings are in files:
- `SubRPDate/config/posts.json` - interaction points
- `SubRPDate/config/level_config.json` - level system
- `SubRPDate/config/map_locations.json` - map locations
- `SubRPDate/config/sell_cars.json` - vehicles for sale
- `SubRPDate/config/achievements_config.json` - achievements

### Business Settings

Business files are in `SubRPDate/buisnes/`:
- `station1.json`, `station2.json` - gas stations
- `cardealership1.json` - dealerships

### Job Settings

Job files are in `SubRPDate/jobs/`:
- `bus.json` - bus routes
- `taxi.json` - taxi configuration
- `cargo.json` - cargo configuration

### Faction Settings

Faction files are in `SubRPDate/fractions/`:
- `police.json` - police configuration

## Communication Protocol

Mod uses standard BeamMP protocol for communication:

### Client → Server Events

- `TriggerSubRPFuelData` - fuel data
- `TriggerSubRPPointUse` - interaction point usage
- `TriggerSubRPpayForFuel` - fuel payment
- `TriggerSubRPChangeBuisnes*` - business management
- `TriggerSubRPbuy_buisnes` - buy business
- `Triggerbuy_car_diler` - buy vehicle
- `Triggerstart_job_bus` - start bus job
- `TriggerSubRPStartTaxi` - start taxi job
- `Triggerstop_job` - stop job
- `Triggerbutton_send_trans` - money transfer
- `Triggerbutton_pay_pdd` - pay fine
- `Triggerfast_use_button` - quick interaction
- `Triggerdeposit_money` - deposit money
- `Triggerwithdraw_money` - withdraw money

### Server → Client Events

- `ClientPacketVehSpawnPos` - vehicle spawn
- `ClientPacketReloadSignals` - reload signals
- `ClientPacketReloadData` - reload data
- `ClientEventUpdateHudData` - HUD update
- `ClientEventHudOpenUI` - open UI
- `ClientRunUINotify` - notification
- `ClientEventadd_fuel_station` - refuel
- `ClientEventset_fuel` - set fuel
- `ClientEventSyncPlace` - license plate sync
- `ClientEventcreate_trigger_pos` - create trigger
- `ClientEventremove_trigger_pos` - remove trigger
- `Clientcreate_object` - create object
- `Clientremove_object` - remove object

## Development

### Module Structure

Each module follows the pattern:
```lua
local M = {}

-- Local functions
local function privateFunction()
    -- ...
end

-- Public functions
M.publicFunction = function()
    -- ...
end

-- Hooks
M.onUpdate = function(dt)
    -- ...
end

M.onExtensionLoaded = function() 
    -- ...
end

return M
```

### Adding New Features

1. **Client-side**:
   - Add function to corresponding module (`SubRPCore.lua` or `SubRPHud.lua`)
   - Register event handler via `AddEventHandler`
   - Update UI if necessary

2. **Server-side**:
   - Register event via `MP.RegisterEvent`
   - Create handler function
   - Use `DataManager` for data operations
   - Send updates to client via `MP.TriggerClientEvent`

### Adding New Businesses

1. Create JSON file in `SubRPDate/buisnes/`
2. Add interaction point to `SubRPDate/config/posts.json`
3. Configure logic in `HudManager.lua` → `SubRPPointUse()`

### Adding New Jobs

1. Create JSON file in `SubRPDate/jobs/`
2. Add interaction point to `SubRPDate/config/posts.json`
3. Implement logic in `DataWorking.lua`
4. Add UI interface if necessary

### Extending UI

UI interface is implemented via HTML/CSS/JavaScript:
1. Modify `app.html` for structure
2. Update `app.js` for logic
3. Configure `style.css` for styles
4. Add new images to `images/` if necessary

## Debugging

### Logging

Server uses logging system:
- `log_success(message)` - successful operations
- `log_error(message)` - errors
- `log_warning(message)` - warnings
- `log_debug(message)` - debug information

Client uses standard BeamNG.drive logging:
- `log('I', 'tag', 'message')` - information message
- `log('W', 'tag', 'message')` - warning
- `log('E', 'tag', 'message')` - error
- `log('D', 'tag', 'message')` - debug

### Data Verification

- Check JSON files in `SubRPDate/`
- Use browser developer console for UI
- Check BeamMP server logs
- Use `dump()` to output data to log

## Compatibility

- **BeamNG.drive**: **0.36** (plugin developed for this version)
- **BeamMP**: latest versions
- **Mods**: compatible with most vehicle mods

## Security

### Cheat Protection

- Anticheat system (speedhack, teleport)
- DDoS protection
- Server-side data validation
- Event validation

### Data Protection

- All data stored on server
- Client has no access to critical data
- Access permission checks for all operations

## License

**AGPL-3.0-or-later** (GNU Affero General Public License v3.0 or later)

All rights are **NOT protected**. Attempting to use without the creator's consent **@Jastickon** will **NOT** be prosecuted by law!

This license allows:
- ✅ Use of code for commercial and non-commercial purposes
- ✅ Code modification
- ✅ Code distribution
- ✅ Use in private projects
- ✅ Everything else you can think of

---

**Author**: @Jastickon  
**Version**: v0.0.1  
**For**: RP project in BeamMP
