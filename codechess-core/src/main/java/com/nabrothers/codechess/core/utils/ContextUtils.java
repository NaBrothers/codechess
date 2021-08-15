package com.nabrothers.codechess.core.utils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ContextUtils {

    private static ThreadLocal<Map<String, Object>> map = new ThreadLocal<>();

    public static void add(String key, Object value) {
        Map<String, Object> contextMap = map.get();
        if (contextMap == null) {
            contextMap = new ConcurrentHashMap<>();
        }
        contextMap.put(key, value);
        map.set(contextMap);
    }

    public static void remove(String key) {
        Map<String, Object> contextMap = map.get();
        if (contextMap != null) {
            contextMap.remove(key);
        }
    }

    public static <T> T get(String key) {
        Map<String, Object> contextMap = map.get();
        if (contextMap != null) {
            return (T) contextMap.get(key);
        } else {
            return null;
        }
    }

    public static void clear() {
        map.remove();
    }
}
