package com.nabrothers.codechess.core.data;

public abstract class Effect extends CodeObject{
    protected long owner;

    protected int status;

    protected int power;

    protected Effect() {
        super();
    }

    protected Effect(int id, int type) {
        super(id, type);
    }

    public long getOwner() {
        return owner;
    }

    public void setOwner(long owner) {
        this.owner = owner;
    }

    abstract protected boolean cast();

    abstract protected boolean addEffect(CodeObject o);

    abstract protected boolean finish();
}
