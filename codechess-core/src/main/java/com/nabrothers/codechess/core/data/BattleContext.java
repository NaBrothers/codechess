package com.nabrothers.codechess.core.data;


import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.dto.InitBattleDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BattleContext {
    private int currentStep;

    private int status;

    private List<BattleContextDTO> history = new ArrayList<>();

    //Mock
    {
        BattleContextDTO b1 = new BattleContextDTO();
        b1.setStep(0);
        history.add(b1);
    }

    private void snapshot() {
        BattleContextDTO battleContextDTO = new BattleContextDTO();
        battleContextDTO.setStep(currentStep);
        history.add(battleContextDTO);
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
