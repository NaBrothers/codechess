package com.nabrothers.codechess.core.controller;

import com.nabrothers.codechess.core.dto.BattleResultDTO;
import com.nabrothers.codechess.core.dto.BattleProcessDTO;
import com.nabrothers.codechess.core.dto.BattleStartDTO;
import com.nabrothers.codechess.core.service.BattleContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/battle")
public class BattleController {

    @Autowired
    private BattleContextService battleContextService;

    @RequestMapping(value = "/start", method = RequestMethod.GET)
    @ResponseBody
    public BattleStartDTO start() {
        BattleStartDTO battleStartDTO = battleContextService.startBattle();
        return battleStartDTO;
    }

    @RequestMapping(value = "/process", method = RequestMethod.GET)
    @ResponseBody
    public BattleProcessDTO process(@RequestParam(value = "id") Integer id) {
        BattleProcessDTO process = battleContextService.getProcess(id);
        return process;
    }

    @RequestMapping(value = "/result", method = RequestMethod.GET)
    @ResponseBody
    public BattleResultDTO result(@RequestParam(value = "id") Integer id) {
        BattleResultDTO result = battleContextService.getBattleResult(id);
        return result;
    }
}
