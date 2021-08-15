package com.nabrothers.codechess.core.utils;

import com.nabrothers.codechess.core.manager.BattleConfigManager;

public class BattleUtils {
    public static int toPx(int x) {
        return x * BattleConfigManager.GRID_SIZE;
    }

    public static int toPx(double x) {
        return (int) Math.floor(x * BattleConfigManager.GRID_SIZE);
    }

    public static int toX(int px) {
        return (int) (px / BattleConfigManager.GRID_SIZE);
    }
}
