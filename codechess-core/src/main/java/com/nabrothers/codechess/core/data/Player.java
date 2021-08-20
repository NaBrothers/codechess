package com.nabrothers.codechess.core.data;

import com.nabrothers.codechess.core.enums.ObjectType;

public class Player extends Entity implements Movable, Effectable{
    public Player() {
        super();
    }

    public Player(int id) {
        super(id, ObjectType.PLAYER.getCode());
    }

    private int hp;

    private long userId;

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

    @Override
    public boolean cast(Effect e) {
        return e.cast();
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
