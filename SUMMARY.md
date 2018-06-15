# 板形模型消化

* [GSM总览](doc/anatomy/gsm_anatomy.md)

* [SSU板形设定模型](doc/ssu/ssu_overview.md)
    * [板形模型初始化](doc/ssu/ssu_init.md)
    * [包络线计算](doc/ssu/ssu_env.md)
    * [凸度分配计算](doc/ssu/ssu_alc.md)
    * [板形评估](doc/ssu/ssu_elv.md)
    * [板形物理模型](doc/ssu/ssu_physical_model.md)
    * [偏导数参数或增益](doc/ssu/ssu_xfer_func.md)

* [凸度分配](doc/allocation/allocation_overview.md)
    <!-- * [2.1 道次出口目标计算](doc/allocation/delivery_pass_targets.md) -->
    * [辊系凸度计算](doc/allocation/roll_stack_crowns.md)
    <!-- * [2.3 UFD均载辊缝凸度计算](doc/allocation/UFD_calc.md) -->
    <!-- * [2.4 CVC等效凸度计算](doc/allocation/roll_grnd_calc.md) -->
    <!-- * [2.5 窜辊设定计算](doc/allocation/pos_shft_actuator.md) -->
    <!-- * [2.6 弯辊设定计算](doc/allocation/bend_frc_actuator.md) -->
    <!-- * [2.7 凸度分配迭代计算](doc/allocation/alc_cycle_calc.md) -->

<!-- * [3 重难点模块与问题](doc/submodel/submodel_overview.md) -->
    <!-- * [3.1 空载辊缝模型](doc/submodel/unloaded_roll_gap_model.md) -->
    <!-- * [3.2 有载辊缝模型](doc/submodel/loaded_roll_gap_model.md) -->
    * [LPCE横向带钢模型](doc/submodel/LPCE_model.md)
    * [LRG横向辊缝模型](doc/submodel/LRG_model.md)
    <!-- * [3.5 临界浪形模型](doc/submodel/critical_buckling_model.md) -->
    <!-- * [3.6 TARGT模块](doc/submodel/TARGT_model.md) -->
    <!-- * [3.7 ALC模块](doc/submodel/ALC_model.md) -->
    <!-- * [3.8 CRLC模块](doc/submodel/CRLC_model.md) -->
    <!-- * [3.9 CVC辊形设计](doc/submodel/cvc_roll_design.md) -->

<!-- * [4 SMLC板形自学习模型](doc/smlc/smlc_overview.md) -->
    <!-- * [4.1 自学习策略](doc/smlc/adapt_strategy.md) -->
    <!-- * [4.2 辊系凸度补偿](doc/smlc/wr_crn_off.md) -->
    <!-- * [4.3 凸度自学习](doc/smlc/profile_adapt.md) -->
    * [平直度自学习](doc/smlc/flatness_adapt.md)
    <!-- * [4.5 有效单位凸度自学习](doc/smlc/eff_pu_profile_adapt.md) -->

<!-- * [5 ROP轧辊模型](doc/rop/rop_overview.md) -->
    <!-- * [5.1 ROP磨损](doc/rop/rop_wear.md) -->
    <!-- * [5.2 ROP热胀](doc/rop/rop_thermal.md) -->

<!-- * [6 SCF平辊窜辊策略模型](doc/scf/scf_overview.md) -->
    <!-- * [6.1 常规辊形窜辊](doc/scf/scf_normal.md) -->
    <!-- * [6.2 正弦异步窜辊](doc/scf/scf_sin.md) -->

<!-- * [7 板形动态控制](doc/dynamic_control/dynamic_control_overview.md) -->
    <!-- * [7.1 ASPC凸度反馈控制](doc/dynamic_control/aspc.md) -->
    <!-- * [7.2 ASFC浪形反馈控制](doc/dynamic_control/asfc.md) -->
    <!-- * [7.3 FFC轧制力跟随控制](doc/dynamic_control/ffc.md) -->
    <!-- * [7.4 TCFC热胀跟随控制](doc/dynamic_control/tcfc.md) -->

* [参数和日志](parameters/parameters_overview.md)
    * [SSU参数日志验算](doc/parameters/ssu_log_checking_calculation.md)
    * [SSU参数日志FAQ](doc/parameters/ssu_log_FAQ.md)
    * [CFG模型参数梳理](doc/parameters/cfg_parameters.md)
    * [CTool参数梳理](doc/parameters/ctool_gsm.md)

* [板形模型实战](doc/actual_combat/actual_combat_overview.md)
    * [目标凸度变化影响板形模型设定](doc/actual_combat/目标凸度变化影响板形模型设定.md)
    <!-- * [9.2 板形能力校核](doc/actual_combat/板形能力校核.md) -->
    <!-- * [9.3 正弦异步窜辊策略的调整](doc/actual_combat/正弦异步窜辊策略的调整.md) -->
    <!-- * [9.4 热轧目标凸度对硅钢同板差的影响](doc/actual_combat/热轧目标凸度对硅钢同板差的影响.md) -->

