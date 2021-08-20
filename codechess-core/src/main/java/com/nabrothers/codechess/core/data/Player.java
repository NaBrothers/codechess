package com.nabrothers.codechess.core.data;

import com.nabrothers.codechess.core.enums.ObjectType;
import com.nabrothers.codechess.core.enums.PlayerStatus;

public class Player extends Entity implements Movable, Effectable{
    public Player() {
        super();
    }

    public Player(int id) {
        super(id, ObjectType.PLAYER.getCode());
    }

    private int hp;

    private long userId;

    private int status;

    @Override
    public boolean move(int dx, int dy) {
        if (status == PlayerStatus.DEAD.getCode()) {
            return false;
        }
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
        if (status == PlayerStatus.DEAD.getCode()) {
            return false;
        }
        int vx = nx - x;
        int vy = ny - y;
        boolean isX = Math.abs(vx) >= Math.abs(vy);
        int dx = vx == 0 ? 0 : (isX ? vx / Math.abs(vx) : 0);
        int dy = vy == 0 ? 0 : (isX ? 0 : vy / Math.abs(vy));
        return move(dx, dy);
    }

    @Override
    public boolean cast(Effect e) {
        if (status == PlayerStatus.DEAD.getCode()) {
            return false;
        }
        e.setOwner(seq);
        return e.cast();
    }


    public int hurt(int v) {
        int nHp = hp - v;
        if (nHp <= 0) {
            hp = 0;
            status = PlayerStatus.DEAD.getCode();
            return status;
        }
        hp = nHp;
        return status;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
