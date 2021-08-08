package com.nabrothers.codechess.core.controller;

import com.nabrothers.codechess.core.data.BattleContext;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.dto.BattleResultDTO;
import com.nabrothers.codechess.core.dto.BattleProcessDTO;
import com.nabrothers.codechess.core.service.BattleContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/battle")
public class BattleController {

    @Autowired
    private BattleContextService battleContextService;

    @RequestMapping(value = "/start", method = RequestMethod.GET)
    @ResponseBody
    public Integer start() {
        return 0;
    }

    @RequestMapping(value = "/process", method = RequestMethod.GET)
    @ResponseBody
    public BattleProcessDTO process() {
        BattleProcessDTO process = battleContextService.getProcess();
        return process;
    }

    @RequestMapping(value = "/result", method = RequestMethod.GET)
    @ResponseBody
    public BattleResultDTO result() {
        BattleResultDTO result = battleContextService.getBattleResult();
        return result;
    }
}
