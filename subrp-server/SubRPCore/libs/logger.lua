
function log_success(text)
    print('\27[37m[\27[32mSuccess\27[37m] | '..text)
end

function log_error(text)
    print('\27[37m[\27[31mError\27[37m] | ' ..text)
end

function log_debug(text)
    print('\27[37m[\27[37mDebug\27[37m] | '..text)
end

function log_warning(text)
    print('\27[37m[\27[33mWarn\27[37m] | '..text)
end

function log_start()
    print("Плагин сделан при поддержке Jastickon")
    print("")
    print("\27[37m-----------------------------------------------------------")
    print("\27[37m|                                                         |")
    print("\27[37m|                                                         |")
    print("\27[37m|                ---------------------                    |")
    print("\27[37m|                |       \27[32mСервер\27[37m      |                    |")
    print("\27[37m|                |     \27[32mЗапущен!!!\27[37m    |                    |")
    print("\27[37m|                ---------------------                    |")
    print("\27[37m|                                                         |")
    print("\27[37m|                                                         |")
    print("\27[37m-----------------------------------------------------------")
end

function log_error_start()
    print("Плагин сделан при поддержке Jastickon")
    print("")
    print("\27[37m-----------------------------------------------------------")
    print("\27[37m|                                                         |")
    print("\27[37m|                                                         |")
    print("\27[37m|                ---------------------                    |")
    print("\27[37m|                |       \27[31mОшибка\27[37m      |                    |")
    print("\27[37m|                |      \27[31mЗапуска\27[37m      |                    |")
    print("\27[37m|                ---------------------                    |")
    print("\27[37m|                                                         |")
    print("\27[37m|                                                         |")
    print("\27[37m-----------------------------------------------------------")
end