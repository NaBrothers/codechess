package com.nabrothers.codechess.core.data;

import com.nabrothers.codechess.core.utils.BattleUtils;

public class Player extends Entity implements Movable{
    public Player() {
        super();
    }

    public Player(int id, int type) {
        super(id, type);
    }

    @Override
    public boolean move(int dx, int dy) {
        if (dx != 0 && dy != 0) {
            return false;
        }
        if (dx != 1 && dx != -1 && dy != 1 && dy != -1) {
            return false;
        }
        x += dx;
        y += dy;
        return true;
    }

    @Override
    public boolean moveTo(int nx, int ny) {
        int vx = nx - x;
        int vy = ny - y;
        boolean isX = Math.abs(vx) >= Math.abs(vy);
        int dx = vx == 0 ? 0 : (isX ? vx / Math.abs(vx) : 0);
        int dy = vy == 0 ? 0 : (isX ? 0 : vy / Math.abs(vy));
        return move(dx, dy);
    }
}
