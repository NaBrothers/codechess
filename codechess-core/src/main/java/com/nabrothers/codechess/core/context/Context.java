package com.nabrothers.codechess.core.context;

import com.nabrothers.codechess.core.enums.ContextStatus;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public abstract class Context {
    protected static final Logger logger = LogManager.getLogger(Context.class);

    protected int id;

    protected int currentStep;

    protected int status;

    private static final int MAX_STEPS = 5000;

    public void start() {
        status = ContextStatus.START.getCode();
        beforeStart();
        while (++currentStep < MAX_STEPS && doStep()) {
        }
        status = ContextStatus.FINISH.getCode();
        afterFinish();
    }

    abstract protected void beforeStart();

    abstract protected boolean doStep();

    abstract protected void afterFinish();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
