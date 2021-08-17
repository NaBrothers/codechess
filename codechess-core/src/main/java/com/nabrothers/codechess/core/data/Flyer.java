package com.nabrothers.codechess.core.data;

import com.nabrothers.codechess.core.context.BattleContext;
import com.nabrothers.codechess.core.enums.EffectStatus;
import com.nabrothers.codechess.core.enums.ObjectType;
import com.nabrothers.codechess.core.utils.BattleUtils;
import com.nabrothers.codechess.core.utils.ContextUtils;

public class Flyer extends Effect implements Movable{
    private int px;
    private int py;
    private int originX;
    private int originY;
    private int targetX;
    private int targetY;
    private double speed;

    public Flyer() {
        super();
    }

    public Flyer(int id) {
        super(id, ObjectType.FLYER.getCode());
    }

    public Flyer(int id, int ox, int oy, int tx, int ty, double speed) {
        this(id);
        this.originX = ox;
        this.originY = oy;
        this.targetX = tx;
        this.targetY = ty;
        this.speed = speed;
        this.px = BattleUtils.toPx(ox);
        this.py = BattleUtils.toPx(oy);
        this.x = ox;
        this.y = oy;
    }


    @Override
    public boolean move(int dpx, int dpy) {
        px += dpx;
        py += dpy;
        x = BattleUtils.toX(px);
        y = BattleUtils.toX(py);
        return true;
    }

    @Override
    public boolean moveTo(int nx, int ny) {
        int npx = BattleUtils.toPx(nx);
        int npy = BattleUtils.toPx(ny);
        int pSpeed = BattleUtils.toPx(speed);
        int vpx = npx - px;
        int vpy = npy - py;
        if (vpx == 0 && vpy == 0) {
            return true;
        }
        double normalize = Math.sqrt(vpx * vpx + vpy * vpy);
        int dpx = (int) Math.floor(vpx * pSpeed / normalize);
        int dpy = (int) Math.floor(vpy * pSpeed / normalize);
        if (Math.abs(dpx) > Math.abs(vpx)) {
            dpx = vpx;
        }
        if (Math.abs(dpy) > Math.abs(vpy)) {
            dpy = vpy;
        }
        return move(dpx, dpy);
    }

    @Override
    public boolean cast() {
        if (status == EffectStatus.CREATE.getCode()) {
            BattleContext context = ContextUtils.get("context");
            if (context.getFlyerMap().containsKey(seq)) {
                status = EffectStatus.START.getCode();
            } else {
                context.getFlyerMap().put(seq, this);
            }
            return true;
        }
        if (status == EffectStatus.FINISH.getCode()) {
            return false;
        }
        moveTo(targetX, targetY);
        if (x == targetX && y == targetY) {
            status = EffectStatus.FINISH.getCode();
        }
        return true;
    }

    public int getPx() {
        return px;
    }

    public void setPx(int px) {
        this.px = px;
    }

    public int getPy() {
        return py;
    }

    public void setPy(int py) {
        this.py = py;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public int getOriginX() {
        return originX;
    }

    public void setOriginX(int originX) {
        this.originX = originX;
    }

    public int getOriginY() {
        return originY;
    }

    public void setOriginY(int originY) {
        this.originY = originY;
    }

    public int getTargetX() {
        return targetX;
    }

    public void setTargetX(int targetX) {
        this.targetX = targetX;
    }

    public int getTargetY() {
        return targetY;
    }

    public void setTargetY(int targetY) {
        this.targetY = targetY;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
