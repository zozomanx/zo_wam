-- Small wait to files to load and pass variables to NUI
Wait(1000)

-- These send the game and overwrite the default values
local gameLength = 5000 -- Seconds how long the game lasts
local minSpeed = 400 -- Lower is harder
local maxSpeed = 800 -- Lower is harder
local amountToWin = 3 -- How many you have to hit to win


----------- FUNCTIONS -----------

-- Function to open the NUI display
function SetDisplay(bool)
    SetNuiFocus(bool, bool)
    SendNUIMessage(
        {
            action = "openWAM",
            gameLength = gameLength,
            minSpeed = minSpeed,
            maxSpeed = maxSpeed,
            amountToWin = amountToWin
        }
    )
end
----------- END FUNCTIONS -----------

----------- Debug -------------------

SetDisplay(true)

----------- End Debug ---------------

----------- NUI CALLBACKS -----------

-- Release NUI focus
RegisterNUICallback('closeWAM', function(_, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Get result of the hack
RegisterNUICallback('gameResult', function(result, cb)
    local gameResult = result.result
    -- print('result is ' .. tostring(gameResult))
    cb('ok')
  end)

-- Wait for the NUI search callback and then trigger the server event sending playerid and search data


----------- END NUI CALLBACKS -----------