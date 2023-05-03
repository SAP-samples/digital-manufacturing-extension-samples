<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xpath-default-namespace="urn:sap-com:document:sap:idoc:soap:messages"
                xmlns:gl="http://sap.com/xi/SAPGlobal20/Global"
                xmlns:pp="http://sap.com/xi/PP/Global2">

    <xsl:template match="/LOIPRO05/IDOC">
        <gl:ManufacturingOrderExecuteRequest_V2>
            <MessageHeader>
                <ID>
                    <xsl:call-template name="generateId">
                        <xsl:with-param name="idocNo" select="EDI_DC40/DOCNUM"/>
                    </xsl:call-template>
                </ID>
                <UUID>
                    <xsl:call-template name="generateId">
                        <xsl:with-param name="idocNo" select="EDI_DC40/DOCNUM"/>
                    </xsl:call-template>
                </UUID>
                <CreationDateTime>
                    <xsl:value-of select="current-dateTime()"/>
                </CreationDateTime>
                <SenderBusinessSystemID>
                    <xsl:value-of select="EDI_DC40/SNDPRN"/>
                </SenderBusinessSystemID>
            </MessageHeader>
            <xsl:apply-templates select="E1AFKOL[1]"/>
        </gl:ManufacturingOrderExecuteRequest_V2>
    </xsl:template>

    <xsl:template match="/LOIPRO05/IDOC/E1AFKOL">
        <ManufacturingOrder>
            <ManufacturingOrder>
                <xsl:value-of select="AUFNR"/>
            </ManufacturingOrder>
            <ManufacturingOrderCategory>
                <xsl:value-of select="AUTYP"/>
            </ManufacturingOrderCategory>
            <ManufacturingOrderType>
                <xsl:value-of select="AUART"/>
            </ManufacturingOrderType>
            <ProductionPlant>
                <xsl:value-of select="WERKS"/>
            </ProductionPlant>
            <Material>
                <xsl:call-template name="getMaterial">
                    <xsl:with-param name="material" select="MATNR"/>
                    <xsl:with-param name="materialExt" select="MATNR_EXTERNAL"/>
                    <xsl:with-param name="materialLong" select="MATNR_LONG"/>
                </xsl:call-template>
            </Material>
            <BillOfMaterialCategory>
                <xsl:value-of select="STLTY"/>
            </BillOfMaterialCategory>
            <BillOfMaterial>
                <xsl:value-of select="STLNR"/>
            </BillOfMaterial>
            <BillOfMaterialVariant>
                <xsl:value-of select="STLAL"/>
            </BillOfMaterialVariant>
            <BillOfMaterialVariantUsage>
                <xsl:value-of select="STLAN"/>
            </BillOfMaterialVariantUsage>
            <BillOfOperationsType>
                <xsl:value-of select="PLNTY"/>
            </BillOfOperationsType>
            <BillOfOperationsGroup>
                <xsl:value-of select="PLNNR"/>
            </BillOfOperationsGroup>
            <BillOfOperationsVariant>
                <xsl:value-of select="PLNAL"/>
            </BillOfOperationsVariant>
            <MfgOrderPlannedTotalQty pp:unitCode="{GMEIN}">
                <xsl:value-of select="GAMNG"/>
            </MfgOrderPlannedTotalQty>
            <MfgOrdPlndTotQtyInBaseUnit pp:unitCode="{BMEINS}">
                <xsl:value-of select="BMENGE"/>
            </MfgOrdPlndTotQtyInBaseUnit>
            <BOOMinLotSizeQuantity pp:unitCode="{PLNME}">
                <xsl:value-of select="PLSVN"/>
            </BOOMinLotSizeQuantity>
            <BOOMaxLotSizeQuantity pp:unitCode="{PLNME}">
                <xsl:value-of select="PLSVB"/>
            </BOOMaxLotSizeQuantity>
            <MfgOrderPlannedStartDate>
                <xsl:call-template name="convertIDocDateFormat">
                    <xsl:with-param name="date" select="GSTRP"/>
                </xsl:call-template>
            </MfgOrderPlannedStartDate>
            <MfgOrderPlannedStartTime>
                <xsl:call-template name="convertIDocTimeFormat">
                    <xsl:with-param name="time" select="GSUZP"/>
                </xsl:call-template>
            </MfgOrderPlannedStartTime>
            <MfgOrderPlannedEndDate>
                <xsl:call-template name="convertIDocDateFormat">
                    <xsl:with-param name="date" select="GLTRP"/>
                </xsl:call-template>
            </MfgOrderPlannedEndDate>
            <MfgOrderPlannedEndTime>
                <xsl:call-template name="convertIDocTimeFormat">
                    <xsl:with-param name="time" select="GLUZP"/>
                </xsl:call-template>
            </MfgOrderPlannedEndTime>
            <MfgOrderScheduledStartDate>
                <xsl:call-template name="convertIDocDateFormat">
                    <xsl:with-param name="date" select="GSTRS"/>
                </xsl:call-template>
            </MfgOrderScheduledStartDate>
            <MfgOrderScheduledStartTime>
                <xsl:call-template name="convertIDocTimeFormat">
                    <xsl:with-param name="time" select="GSUZS"/>
                </xsl:call-template>
            </MfgOrderScheduledStartTime>
            <MfgOrderScheduledEndDate>
                <xsl:call-template name="convertIDocDateFormat">
                    <xsl:with-param name="date" select="GLTRS"/>
                </xsl:call-template>
            </MfgOrderScheduledEndDate>
            <MfgOrderScheduledEndTime>
                <xsl:call-template name="convertIDocTimeFormat">
                    <xsl:with-param name="time" select="GLUZS"/>
                </xsl:call-template>
            </MfgOrderScheduledEndTime>
            <InspectionLot>
                <xsl:if test="PRUEFLOS != '' and number(PRUEFLOS) != 0">
                    <xsl:value-of select="substring(concat('000000000000',PRUEFLOS),string-length(PRUEFLOS)+1)"/>
                </xsl:if>
            </InspectionLot>
            <ZSchedulingType>
                <xsl:value-of select="TERKZ"/>
            </ZSchedulingType>
            <xsl:if test="E1AFLTH">
                <LongText pp:MIMECode="application/json" pp:TextCategory="{E1AFLTH[1]/TDTEXTTYPE}">
                    <xsl:call-template name="convertLanguageCode">
                        <xsl:with-param name="spras" select="E1AFLTH[1]/TDSPRAS"/>
                    </xsl:call-template>
                    [<xsl:for-each select="E1AFLTH[1]/E1AFLTP">{"TDFORMAT":"<xsl:value-of select="TDFORMAT"/>","TDLINE":"<xsl:value-of select="TDLINE"/>"}<xsl:if test="position() != last()">,</xsl:if></xsl:for-each>]
                </LongText>
            </xsl:if>
            <ManufacturingOrderSystemStatus>
                <xsl:if test="E1JSTKL[STAT='I0328']">
                    <pp:OrderHasGeneratedOperations>true</pp:OrderHasGeneratedOperations>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0046']">
                    <pp:OrderIsClosed>true</pp:OrderIsClosed>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0009']">
                    <pp:OrderIsConfirmed>true</pp:OrderIsConfirmed>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0001']">
                    <pp:OrderIsCreated>true</pp:OrderIsCreated>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0013']">
                    <pp:OrderIsDeleted>true</pp:OrderIsDeleted>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0012']">
                    <pp:OrderIsDelivered>true</pp:OrderIsDelivered>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0043']">
                    <pp:OrderIsLocked>true</pp:OrderIsLocked>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0076']">
                    <pp:OrderIsMarkedForDeletion>true</pp:OrderIsMarkedForDeletion>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0010']">
                    <pp:OrderIsPartiallyConfirmed>true</pp:OrderIsPartiallyConfirmed>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0074']">
                    <pp:OrderIsPartiallyDelivered>true</pp:OrderIsPartiallyDelivered>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0042']">
                    <pp:OrderIsPartiallyReleased>true</pp:OrderIsPartiallyReleased>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0016']">
                    <pp:OrderIsPreCosted>true</pp:OrderIsPreCosted>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0007']">
                    <pp:OrderIsPrinted>true</pp:OrderIsPrinted>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0002']">
                    <pp:OrderIsReleased>true</pp:OrderIsReleased>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0117']">
                    <pp:OrderIsScheduled>true</pp:OrderIsScheduled>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0045']">
                    <pp:OrderIsTechnicallyCompleted>true</pp:OrderIsTechnicallyCompleted>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0369']">
                    <pp:OrderIsToBeHandledInBatches>true</pp:OrderIsToBeHandledInBatches>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0028']">
                    <pp:SettlementRuleIsCreated>true</pp:SettlementRuleIsCreated>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0102']">
                    <pp:SettlementRuleIsCrtedManually>true</pp:SettlementRuleIsCrtedManually>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0420']">
                    <pp:MaterialAvailyIsNotChecked>true</pp:MaterialAvailyIsNotChecked>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0667']">
                    <pp:OrderChangeIsRestricted>true</pp:OrderChangeIsRestricted>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0239']">
                    <pp:OrderHasNoMaterialComponents>true</pp:OrderHasNoMaterialComponents>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0321']">
                    <pp:OrderHasPostedGoodsMovements>true</pp:OrderHasPostedGoodsMovements>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0048']">
                    <pp:OrderIsDistributedToMES>true</pp:OrderIsDistributedToMES>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0666']">
                    <pp:OrderIsHandedOverToProduction>true</pp:OrderIsHandedOverToProduction>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0665']">
                    <pp:OrderIsShopFloorOrder>true</pp:OrderIsShopFloorOrder>
                </xsl:if>
                <xsl:if test="E1JSTKL[STAT='I0340']">
                    <pp:MaterialIsCommitted>true</pp:MaterialIsCommitted>
                </xsl:if>
            </ManufacturingOrderSystemStatus>

            <xsl:for-each select="E1AFPOL">
                <ManufacturingOrderItem>
                    <ManufacturingOrderItem>
                        <xsl:value-of select="POSNR"/>
                    </ManufacturingOrderItem>
                    <Material>
                        <xsl:call-template name="getMaterial">
                            <xsl:with-param name="material" select="MATNR"/>
                            <xsl:with-param name="materialExt" select="MATNR_EXTERNAL"/>
                            <xsl:with-param name="materialLong" select="MATNR_LONG"/>
                        </xsl:call-template>
                    </Material>
                    <MfgOrderItemPlannedTotalQty pp:unitCode="{AMEIN}">
                        <xsl:value-of select="PSMNG"/>
                    </MfgOrderItemPlannedTotalQty>
                    <Batch>
                        <xsl:value-of select="CHARG"/>
                    </Batch>
                    <ProductionVersion>
                        <xsl:value-of select="VERID"/>
                    </ProductionVersion>
                    <StorageLocation>
                        <xsl:value-of select="LGORT"/>
                    </StorageLocation>
                    <Warehouse>
                        <xsl:value-of select="LGNUM"/>
                    </Warehouse>

                    <xsl:if test="E1AFSER">
                        <MfgOrderSerialNumbers>
                            <xsl:for-each select="E1AFSER">
                                <MfgOrderSerialNumber>
                                    <SerialNumber>
                                        <xsl:value-of select="SERNR"/>
                                    </SerialNumber>
                                    <UniqueItemIdentifier>
                                        <xsl:value-of select="UII"/>
                                    </UniqueItemIdentifier>
                                </MfgOrderSerialNumber>
                            </xsl:for-each>
                        </MfgOrderSerialNumbers>
                    </xsl:if>

                    <GoodsReceiptTolerances>
                        <pp:UnderdelivTolrtdLmtRatioInPct>
                            <xsl:value-of select="UNTTO"/>
                        </pp:UnderdelivTolrtdLmtRatioInPct>
                        <pp:UnlimitedOverdeliveryIsAllowed>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="UEBTK"/>
                            </xsl:call-template>
                        </pp:UnlimitedOverdeliveryIsAllowed>
                        <pp:OverdelivTolrtdLmtRatioInPct>
                            <xsl:value-of select="UEBTO"/>
                        </pp:OverdelivTolrtdLmtRatioInPct>
                    </GoodsReceiptTolerances>

                </ManufacturingOrderItem>
            </xsl:for-each>

            <xsl:apply-templates select="E1AFFLL"/>

            <xsl:if test="E1VCCHR">
                <ManufacturingOrderVariantConfiguration>
                    <xsl:apply-templates select="E1VCCHR"/>
                </ManufacturingOrderVariantConfiguration>
            </xsl:if>

            <!-- Sample for custom field on order level -->
            <CustomFieldList>
                <CustomField>
                    <Attribute>CD_SALES_ORDER_ID</Attribute>
                    <Value><xsl:value-of select="E1AFPOL/KDAUF"/></Value>
                </CustomField>
                <CustomField>
                    <Attribute>CD_ACTIVITY_ID</Attribute>
                    <Value><xsl:value-of select="E1AFFLL/E1AFVOL[1]/VORNR"/></Value>
                </CustomField>
                <CustomField>
                    <Attribute>CD_FIXED_VALUE</Attribute>
                        <Value>I Will Be Displayed in DMC</Value>
                </CustomField>
                <CustomField>
                    <Attribute>CD_CUSTOMER_NAME</Attribute>
                        <Value><xsl:value-of select="E1AFPOL/NAME1"/></Value>
                </CustomField>
            </CustomFieldList>
            <!-- -->
            <xsl:if test="E1AFPOL[POSNR='0001']/KUNAG != '' and E1AFPOL[POSNR='0001']/NAME1 != ''">
                <ErpCustomer>
                    <Customer>
                        <xsl:value-of select="E1AFPOL[POSNR='0001']/KUNAG"/>
                    </Customer>
                    <CustomerName>
                        <xsl:value-of select="E1AFPOL[POSNR='0001']/NAME1"/>
                    </CustomerName>
                </ErpCustomer>
            </xsl:if>
            <!-- Duplicate with below <SalesOrder> and <SalesOrderItem> ,May be deleted in 2211 release -->

            <xsl:if test="E1AFPOL[POSNR='0001']/KDAUF">
                <ErpCustomerOrder>
                    <CustomerOrder>
                        <xsl:value-of select="E1AFPOL[POSNR='0001']/KDAUF"/>
                    </CustomerOrder>
                    <CustomerOrderItem>
                        <xsl:value-of select="E1AFPOL[POSNR='0001']/KDPOS"/>
                    </CustomerOrderItem>
                </ErpCustomerOrder>
            </xsl:if>
            <xsl:if test="E1AFPOL[POSNR='0001']/KDAUF">
                <SalesOrder>
                    <xsl:value-of select="E1AFPOL[POSNR='0001']/KDAUF"/>
                </SalesOrder>
                <SalesOrderItem>
                    <xsl:value-of select="E1AFPOL[POSNR='0001']/KDPOS"/>
                </SalesOrderItem>
            </xsl:if>
        </ManufacturingOrder>

        <!-- Work Instruction -->
        <workInstructionListIn>
            <xsl:variable name="routing">
                <xsl:value-of select="AUFNR"/>
            </xsl:variable>

            <xsl:for-each select="E1AFDFH/E1AFDHO">
                <workInstructionIn>
                    <workInstruction>
                        <xsl:call-template name="addWorkInstructionName">
                            <xsl:with-param name="docName" select="../DOKNR"/>
                            <xsl:with-param name="docType" select="../DOKAR"/>
                            <xsl:with-param name="docPart" select="../DOKTL"/>
                            <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                            <xsl:with-param name="shopOrder" select="../../AUFNR"/>
                        </xsl:call-template>
                    </workInstruction>
                    <version>
                        <xsl:value-of select="../DOKVR"/>
                    </version>
                    <erpFilename>
                        <xsl:value-of select="FILENAME"/>
                    </erpFilename>
                    <url>
                        <xsl:value-of select="URL"/>
                    </url>
                    <xsl:choose>
                        <xsl:when test="string(DESCRIPTION)!=''">
                            <description>
                                <xsl:value-of select="DESCRIPTION"/>
                            </description>
                        </xsl:when>
                        <xsl:otherwise>
                            <description>
                                <xsl:value-of select="../DKTXT"/>
                            </description>
                        </xsl:otherwise>
                    </xsl:choose>
                    <attachmentList>
                        <workInstructionAttachmentPointDTO>
                            <shopOrderDTO>
                                <shopOrder>
                                    <xsl:value-of select="../../AUFNR"/>
                                </shopOrder>
                            </shopOrderDTO>
                        </workInstructionAttachmentPointDTO>
                    </attachmentList>
                </workInstructionIn>
            </xsl:for-each>
            <xsl:for-each select="E1AFFLL/E1AFVOL">
                <xsl:variable name="stepIdCounter" select="position()"/>
                <xsl:for-each select="E1AFDFO/E1AFDOO">
                    <workInstructionIn>
                        <workInstruction>
                            <xsl:call-template name="addWorkInstructionName">
                                <xsl:with-param name="docName" select="../DOKNR"/>
                                <xsl:with-param name="docType" select="../DOKAR"/>
                                <xsl:with-param name="docPart" select="../DOKTL"/>
                                <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                                <xsl:with-param name="shopOrder" select="../../../../AUFNR"/>
                            </xsl:call-template>
                        </workInstruction>
                        <version>
                            <xsl:value-of select="../DOKVR"/>
                        </version>
                        <erpFilename>
                            <xsl:value-of select="FILENAME"/>
                        </erpFilename>
                        <url>
                            <xsl:value-of select="URL"/>
                        </url>
                        <xsl:choose>
                            <xsl:when test="string(DESCRIPTION)!=''">
                                <description>
                                    <xsl:value-of select="DESCRIPTION"/>
                                </description>
                            </xsl:when>
                            <xsl:otherwise>
                                <description>
                                    <xsl:value-of select="../DKTXT"/>
                                </description>
                            </xsl:otherwise>
                        </xsl:choose>
                        <attachmentList>
                            <workInstructionAttachmentPointDTO>
                                <shopOrderDTO>
                                    <shopOrder>
                                        <xsl:value-of select="../../../../AUFNR"/>
                                    </shopOrder>
                                </shopOrderDTO>
                                <xsl:choose>
                                    <xsl:when test="../RSPOS">
                                        <bomComponentRef>
                                            <bomDTO>
                                                <bom>
                                                    <!--
                                                    <xsl:call-template name="addBomName">
                                                        <xsl:with-param name="material" select="/*/IDOC/E1AFKOL/MATNR"/>
                                                        <xsl:with-param name="materialExt"
                                                            select="/*/IDOC/E1AFKOL/MATNR_EXTERNAL"/>
                                                        <xsl:with-param name="materialLong"
                                                            select="/*/IDOC/E1AFKOL/MATNR_LONG"/>
                                                        <xsl:with-param name="usage" select="/*/IDOC/E1AFKOL/STLAN"/>
                                                        <xsl:with-param name="altBom" select="/*/IDOC/E1AFKOL/STLAL"/>
                                                    </xsl:call-template>
                                                    -->
                                                    <xsl:value-of select="AUFNR"/>
                                                </bom>
                                                <bomType>U</bomType>
                                            </bomDTO>
                                            <materialDTO>
                                                <material>
                                                    <xsl:call-template name="addMaterial">
                                                        <xsl:with-param name="material" select="/*/IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL[RSPOS=current()/../RSPOS]/MATNR"/>
                                                        <xsl:with-param name="materialExt" select="/*/IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL[RSPOS=current()/../RSPOS]/MATNR_EXTERNAL"/>
                                                        <xsl:with-param name="materialLong" select="/*/IDOC/E1AFKOL/E1AFFLL/E1AFVOL/E1RESBL[RSPOS=current()/../RSPOS]/MATNR_LONG"/>
                                                    </xsl:call-template>
                                                </material>
                                                <version>#</version>
                                            </materialDTO>
                                            <sequence>
                                                <xsl:value-of select="string(number(../RSPOS)*10)"/>
                                            </sequence>
                                        </bomComponentRef>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <routingDTO>
                                            <routing>
                                                <xsl:value-of select="$routing"/>
                                            </routing>
                                            <version>A</version>
                                            <routingType>U</routingType>
                                        </routingDTO>
                                        <routingStepRef>
                                            <stepId>
                                                <xsl:choose>
                                                    <xsl:when test="../../E1AFREF/MES_STEPID">
                                                        <xsl:value-of select="../../E1AFREF/MES_STEPID"/>
                                                    </xsl:when>
                                                    <xsl:when test="../../VORNR">
                                                        <xsl:value-of select="../../VORNR"/>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:number value="$stepIdCounter*10"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </stepId>
                                            <xsl:if test="../../ME_REVISION">
                                                <version>
                                                    <xsl:value-of select="../../ME_REVISION"/>
                                                </version>
                                            </xsl:if>
                                            <routingDTO>
                                                <routing>
                                                    <xsl:value-of select="$routing"/>
                                                </routing>
                                                <version>A</version>
                                                <routingType>U</routingType>
                                            </routingDTO>
                                        </routingStepRef>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </workInstructionAttachmentPointDTO>
                        </attachmentList>
                    </workInstructionIn>
                </xsl:for-each>
                <xsl:for-each select="E1AFDOC/E1AFDPO">
                    <workInstructionIn>
                        <workInstruction>
                            <xsl:call-template name="addWorkInstructionName">
                                <xsl:with-param name="docName" select="../DOKNR"/>
                                <xsl:with-param name="docType" select="../DOKAR"/>
                                <xsl:with-param name="docPart" select="../DOKTL"/>
                                <xsl:with-param name="docOriginal" select="ORIGINAL"/>
                                <xsl:with-param name="shopOrder" select="../../../../AUFNR"/>
                            </xsl:call-template>
                        </workInstruction>
                        <version>
                            <xsl:value-of select="../DOKVR"/>
                        </version>
                        <erpFilename>
                            <xsl:value-of select="FILENAME"/>
                        </erpFilename>
                        <url>
                            <xsl:value-of select="URL"/>
                        </url>
                        <xsl:choose>
                            <xsl:when test="string(DESCRIPTION)!=''">
                                <description>
                                    <xsl:value-of select="DESCRIPTION"/>
                                </description>
                            </xsl:when>
                            <xsl:otherwise>
                                <description>
                                    <xsl:value-of select="../FHKTX"/>
                                </description>
                            </xsl:otherwise>
                        </xsl:choose>
                        <attachmentList>
                            <workInstructionAttachmentPointDTO>
                                <shopOrderDTO>
                                    <shopOrder>
                                        <xsl:value-of select="../../../../AUFNR"/>
                                    </shopOrder>
                                </shopOrderDTO>
                                <routingDTO>
                                    <routing>
                                        <xsl:value-of select="$routing"/>
                                    </routing>
                                    <version>A</version>
                                    <routingType>U</routingType>
                                </routingDTO>
                                <routingStepRef>
                                    <stepId>
                                        <xsl:choose>
                                            <xsl:when test="../../E1AFREF/MES_STEPID">
                                                <xsl:value-of select="../../E1AFREF/MES_STEPID"/>
                                            </xsl:when>
                                            <xsl:when test="../../VORNR">
                                                <xsl:value-of select="../../VORNR"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:number value="$stepIdCounter*10"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </stepId>
                                    <xsl:if test="../../ME_REVISION">
                                        <version>
                                            <xsl:value-of select="../../ME_REVISION"/>
                                        </version>
                                    </xsl:if>
                                    <routingDTO>
                                        <routing>
                                            <xsl:value-of select="$routing"/>
                                        </routing>
                                        <version>A</version>
                                        <routingType>U</routingType>
                                    </routingDTO>
                                </routingStepRef>
                            </workInstructionAttachmentPointDTO>
                        </attachmentList>
                    </workInstructionIn>
                </xsl:for-each>
            </xsl:for-each>
        </workInstructionListIn>

    </xsl:template>

    <xsl:template match="/LOIPRO05/IDOC/E1AFKOL/E1AFFLL">
        <xsl:for-each select="E1AFVOL[E1JSTVL[last()]/STAT!='I0013']">
            <ManufacturingOrderActivityNetworkElement>
                <pp:MfgOrderNodeType>Operation</pp:MfgOrderNodeType>
                <pp:MfgOrderNodeID>
                    <xsl:value-of select="concat('OP', VORNR)"/>
                </pp:MfgOrderNodeID>
                <pp:OrderInternalBillOfOperations/>
                <pp:OrderIntBillOfOperationsItem>
                    <xsl:value-of select="VORNR"/>
                </pp:OrderIntBillOfOperationsItem>
                <pp:ManufacturingOrderOperation>
                    <xsl:value-of select="VORNR"/>
                </pp:ManufacturingOrderOperation>
                <pp:ZMinimumSendAheadQuantity pp:unitCode="{MEINH}">
                    <xsl:value-of select="MINWE"/>
                </pp:ZMinimumSendAheadQuantity>
                <pp:ZMinimumOverlapTime pp:unitCode="{ZEIMU}">
                    <xsl:value-of select="ZMINU"/>
                </pp:ZMinimumOverlapTime>
                <pp:ZOptionalOverlapping>
                    <xsl:call-template name="convertToBool">
                        <xsl:with-param name="bool" select="UEKAN"/>
                    </xsl:call-template>
                </pp:ZOptionalOverlapping>
                <pp:ZRequiredOverlapping>
                    <xsl:call-template name="convertToBool">
                        <xsl:with-param name="bool" select="UEMUS"/>
                    </xsl:call-template>
                </pp:ZRequiredOverlapping>
                <pp:ZFlowManufacturing>
                    <xsl:call-template name="convertToBool">
                        <xsl:with-param name="bool" select="FLIES"/>
                    </xsl:call-template>
                </pp:ZFlowManufacturing>
                <pp:ManufacturingOrderSequence>
                    <xsl:value-of select="../PLNFL"/>
                </pp:ManufacturingOrderSequence>
                <pp:WorkCenter>
                    <xsl:value-of select="ARBPL"/>
                </pp:WorkCenter>
                <pp:WorkCenterInternalID>
                    <xsl:value-of select="ARBID"/>
                </pp:WorkCenterInternalID>
                <pp:OpPlannedTotalQuantity pp:unitCode="{MEINH}">
                    <xsl:value-of select="MGVRG"/>
                </pp:OpPlannedTotalQuantity>
                <pp:OperationReferenceQuantity pp:unitCode="{MEINH}">
                    <xsl:value-of select="BMSCH"/>
                </pp:OperationReferenceQuantity>
                <pp:MfgOrderOperationText>
                    <xsl:value-of select="LTXA1"/>
                </pp:MfgOrderOperationText>
                <pp:MfgOrderSequenceText>
                    <xsl:value-of select="../LTXA1"/>
                </pp:MfgOrderSequenceText>
                <pp:FactoryCalendar>
                    <xsl:value-of select="KALID"/>
                </pp:FactoryCalendar>
                <pp:OpErlstSchedldExecStrtDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="FSAVD"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldExecStrtDte>
                <pp:OpErlstSchedldExecStrtTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="FSAVZ"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldExecStrtTme>
                <pp:OpErlstSchedldExecEndDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="FSEDD"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldExecEndDte>
                <pp:OpErlstSchedldExecEndTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="FSEDZ"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldExecEndTme>
                <pp:OpLtstSchedldExecStrtDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="SSAVD"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldExecStrtDte>
                <pp:OpLtstSchedldExecStrtTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="SSAVZ"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldExecStrtTme>
                <pp:OpLtstSchedldExecEndDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="SSEDD"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldExecEndDte>
                <pp:OpLtstSchedldExecEndTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="SSEDZ"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldExecEndTme>
                <pp:EarliestFinishOfOperationDate>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="FSEVD"/>
                    </xsl:call-template>
                </pp:EarliestFinishOfOperationDate>
                <pp:EarliestFinishOfOperationTime>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="FSEVZ"/>
                    </xsl:call-template>
                </pp:EarliestFinishOfOperationTime>
                <pp:OpErlstSchedldProcgStrtDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="FSSBD"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldProcgStrtDte>
                <pp:OpErlstSchedldProcgStrtTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="FSSBZ"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldProcgStrtTme>
                <pp:OpLtstSchedldProcgStrtDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="SSSBD"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldProcgStrtDte>
                <pp:OpLtstSchedldProcgStrtTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="SSSBZ"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldProcgStrtTme>
                <pp:OpPlannedProcessingDurn unitCode="{BEAZE}">
                    <xsl:value-of select="BEARZ"/>
                </pp:OpPlannedProcessingDurn>
                <pp:OpErlstSchedldTrdwnStrtDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="FSSAD"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldTrdwnStrtDte>
                <pp:OpErlstSchedldTrdwnStrtTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="FSSAZ"/>
                    </xsl:call-template>
                </pp:OpErlstSchedldTrdwnStrtTme>
                <pp:OpLtstSchedldTrdwnStrtDte>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="SSSAD"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldTrdwnStrtDte>
                <pp:OpLtstSchedldTrdwnStrtTme>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="SSSAZ"/>
                    </xsl:call-template>
                </pp:OpLtstSchedldTrdwnStrtTme>
                <pp:LatestScheduledWaitEndDate>
                    <xsl:call-template name="convertIDocDateFormat">
                        <xsl:with-param name="date" select="SSELD"/>
                    </xsl:call-template>
                </pp:LatestScheduledWaitEndDate>
                <pp:LatestScheduledWaitEndTime>
                    <xsl:call-template name="convertIDocTimeFormat">
                        <xsl:with-param name="time" select="SSELZ"/>
                    </xsl:call-template>
                </pp:LatestScheduledWaitEndTime>
                <pp:OpPlannedSetupDurn unitCode="{RSTZE}">
                    <xsl:value-of select="RUEST"/>
                </pp:OpPlannedSetupDurn>
                <pp:OpPlannedTeardownDurn unitCode="{ARUZE}">
                    <xsl:value-of select="ABRUE"/>
                </pp:OpPlannedTeardownDurn>
                <pp:ScheduledWaitDuration unitCode="{ARUZE}">
                    <xsl:value-of select="ABRUE"/>
                </pp:ScheduledWaitDuration>
                <pp:TeardownAndWaitIsParallel>
                    <xsl:call-template name="convertToBool">
                        <xsl:with-param name="bool" select="ABLIPKZ"/>
                    </xsl:call-template>
                </pp:TeardownAndWaitIsParallel>
                <pp:MfgOrderConfirmationGroup/>
                <pp:OperationControlProfile pp:OperationControlKey="{STEUS}">
                    <pp:CompletionConfirmation pp:CompletionConfirmationCode="{RUEK}">
                        <ConfirmationIsMilestoneConf>
                            <xsl:choose>
                                <xsl:when test="RUEK='1'">
                                    <xsl:value-of select="true()"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="false()"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </ConfirmationIsMilestoneConf>
                        <ConfirmationIsRequired>
                            <xsl:choose>
                                <xsl:when test="RUEK='2'">
                                    <xsl:value-of select="true()"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="false()"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </ConfirmationIsRequired>
                        <ConfirmationIsNotPossible>
                            <xsl:choose>
                                <xsl:when test="RUEK='3'">
                                    <xsl:value-of select="true()"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="false()"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </ConfirmationIsNotPossible>
                        <ConfirmationIsOptional>
                            <xsl:choose>
                                <xsl:when test="RUEK=(' ','0','') or empty(RUEK)">
                                    <xsl:value-of select="true()"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="false()"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </ConfirmationIsOptional>
                    </pp:CompletionConfirmation>
                    <pp:OperationIsScheduled>
                        <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/TERM"/>
                        </xsl:call-template>
                    </pp:OperationIsScheduled>
                    <pp:CapacityRequirementsAreDtmnd>
                        <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/KAPA"/>
                        </xsl:call-template>
                    </pp:CapacityRequirementsAreDtmnd>
                    <pp:GRIsPostedAutomatically>
                        <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/AUTWE"/>
                        </xsl:call-template>
                    </pp:GRIsPostedAutomatically>
                    <pp:OperationIsNotMESRelevant>
                        <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/NOT_MES_REL"/>
                        </xsl:call-template>
                    </pp:OperationIsNotMESRelevant>
                </pp:OperationControlProfile>
                <pp:StandardWorkFormulaParamGroup StandardWorkFormulaParamGroupID="{VGWTS}">
                    <xsl:if test="VGE01 != ''">
                        <WorkCenterFormulaParam1 WorkCenterFormulaParamID="">
                            <StandardWorkFormulaParamName languageCode="">
                                <xsl:value-of select="E1AFVOL2/PAR01_LTXT"/>
                            </StandardWorkFormulaParamName>
                            <WorkCenterStandardWorkQty pp:unitCode="{VGE01}">
                                <xsl:value-of select="VGW01"/>
                            </WorkCenterStandardWorkQty>
                            <CostCtrActivityType>
                                <xsl:value-of select="LAR01"/>
                            </CostCtrActivityType>
                            <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM1}">
                                <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY1"/>
                            </ToBeConfirmedTotalWorkQty>
                        </WorkCenterFormulaParam1>
                    </xsl:if>
                    <xsl:if test="VGE02 != ''">
                        <WorkCenterFormulaParam2 WorkCenterFormulaParamID="">
                            <StandardWorkFormulaParamName languageCode="">
                                <xsl:value-of select="E1AFVOL2/PAR02_LTXT"/>
                            </StandardWorkFormulaParamName>
                            <WorkCenterStandardWorkQty pp:unitCode="{VGE02}">
                                <xsl:value-of select="VGW02"/>
                            </WorkCenterStandardWorkQty>
                            <CostCtrActivityType>
                                <xsl:value-of select="LAR02"/>
                            </CostCtrActivityType>
                            <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM2}">
                                <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY2"/>
                            </ToBeConfirmedTotalWorkQty>
                        </WorkCenterFormulaParam2>
                    </xsl:if>
                    <xsl:if test="VGE03 != ''">
                        <WorkCenterFormulaParam3 WorkCenterFormulaParamID="">
                            <StandardWorkFormulaParamName languageCode="">
                                <xsl:value-of select="E1AFVOL2/PAR03_LTXT"/>
                            </StandardWorkFormulaParamName>
                            <WorkCenterStandardWorkQty pp:unitCode="{VGE03}">
                                <xsl:value-of select="VGW03"/>
                            </WorkCenterStandardWorkQty>
                            <CostCtrActivityType>
                                <xsl:value-of select="LAR03"/>
                            </CostCtrActivityType>
                            <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM3}">
                                <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY3"/>
                            </ToBeConfirmedTotalWorkQty>
                        </WorkCenterFormulaParam3>
                    </xsl:if>
                    <xsl:if test="VGE04 != ''">
                        <WorkCenterFormulaParam4 WorkCenterFormulaParamID="">
                            <StandardWorkFormulaParamName languageCode="">
                                <xsl:value-of select="E1AFVOL2/PAR04_LTXT"/>
                            </StandardWorkFormulaParamName>
                            <WorkCenterStandardWorkQty pp:unitCode="{VGE04}">
                                <xsl:value-of select="VGW04"/>
                            </WorkCenterStandardWorkQty>
                            <CostCtrActivityType>
                                <xsl:value-of select="LAR04"/>
                            </CostCtrActivityType>
                            <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM4}">
                                <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY4"/>
                            </ToBeConfirmedTotalWorkQty>
                        </WorkCenterFormulaParam4>
                    </xsl:if>
                    <xsl:if test="VGE05 != ''">
                        <WorkCenterFormulaParam5 WorkCenterFormulaParamID="">
                            <StandardWorkFormulaParamName languageCode="">
                                <xsl:value-of select="E1AFVOL2/PAR05_LTXT"/>
                            </StandardWorkFormulaParamName>
                            <WorkCenterStandardWorkQty pp:unitCode="{VGE05}">
                                <xsl:value-of select="VGW05"/>
                            </WorkCenterStandardWorkQty>
                            <CostCtrActivityType>
                                <xsl:value-of select="LAR05"/>
                            </CostCtrActivityType>
                            <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM5}">
                                <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY5"/>
                            </ToBeConfirmedTotalWorkQty>
                        </WorkCenterFormulaParam5>
                    </xsl:if>
                    <xsl:if test="VGE06 != ''">
                        <WorkCenterFormulaParam6 WorkCenterFormulaParamID="">
                            <StandardWorkFormulaParamName languageCode="">
                                <xsl:value-of select="E1AFVOL2/PAR06_LTXT"/>
                            </StandardWorkFormulaParamName>
                            <WorkCenterStandardWorkQty pp:unitCode="{VGE06}">
                                <xsl:value-of select="VGW06"/>
                            </WorkCenterStandardWorkQty>
                            <CostCtrActivityType>
                                <xsl:value-of select="LAR06"/>
                            </CostCtrActivityType>
                            <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM6}">
                                <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY6"/>
                            </ToBeConfirmedTotalWorkQty>
                        </WorkCenterFormulaParam6>
                    </xsl:if>
                </pp:StandardWorkFormulaParamGroup>
                <xsl:for-each select="E1RESBL">
                    <pp:ManufacturingOrderComponent>
                        <RequirementType>
                            <xsl:value-of select="BDART"/>
                        </RequirementType>
                        <RequiredQuantityInBaseUnit pp:unitCode="{MEINS}">
                            <xsl:value-of select="BDMNG"/>
                        </RequiredQuantityInBaseUnit>
                        <MatlCompRequirementDate>
                            <xsl:call-template name="convertIDocDateFormat">
                                <xsl:with-param name="date" select="BDTER"/>
                            </xsl:call-template>
                        </MatlCompRequirementDate>
                        <Batch>
                            <xsl:value-of select="CHARG"/>
                        </Batch>
                        <Material>
                            <xsl:call-template name="getMaterial">
                                <xsl:with-param name="material" select="MATNR"/>
                                <xsl:with-param name="materialExt" select="MATNR_EXTERNAL"/>
                                <xsl:with-param name="materialLong" select="MATNR_LONG"/>
                            </xsl:call-template>
                        </Material>
                        <Reservation>
                            <xsl:value-of select="RSNUM"/>
                        </Reservation>
                        <ReservationItem>
                            <xsl:value-of select="RSPOS"/>
                        </ReservationItem>
                        <GoodsMovementType>
                            <xsl:value-of select="BWART"/>
                        </GoodsMovementType>
                        <BillOfMaterialItemNumber>
                            <xsl:value-of select="POSNR"/>
                        </BillOfMaterialItemNumber>
                        <BillOfMaterialItemCategory>
                            <xsl:value-of select="POSTP"/>
                        </BillOfMaterialItemCategory>
                        <ManufacturingOrderItem>
                            <xsl:value-of select="AFPOS"/>
                        </ManufacturingOrderItem>
                        <BillOfMaterial>
                            <xsl:value-of select="STLNR"/>
                        </BillOfMaterial>
                        <BillOfMaterialItemNodeNumber>
                            <xsl:value-of select="STLKN"/>
                        </BillOfMaterialItemNodeNumber>
                        <SupplyArea>
                            <xsl:value-of select="PRVBE"/>
                        </SupplyArea>
                        <StorageLocation>
                            <xsl:value-of select="LGORT"/>
                        </StorageLocation>
                        <Warehouse>
                            <xsl:value-of select="LGNUM"/>
                        </Warehouse>
                        <MatlCompIsMarkedForBackflush>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="BACKFLUSH"/>
                            </xsl:call-template>
                        </MatlCompIsMarkedForBackflush>
                        <MaterialIsCoProduct>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="KZKUP"/>
                            </xsl:call-template>
                        </MaterialIsCoProduct>
                        <DebitCreditCode>
                            <xsl:value-of select="SHKZG"/>
                        </DebitCreditCode>
                        <InventorySpecialStockType>
                            <xsl:value-of select="SOBKZ"/>
                        </InventorySpecialStockType>
                        <MaterialCompIsAlternativeItem>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="ALPOS"/>
                            </xsl:call-template>
                        </MaterialCompIsAlternativeItem>
                        <AlternativeItemGroup>
                            <xsl:value-of select="ALPGR"/>
                        </AlternativeItemGroup>
                        <AlternativeItemPriority>
                            <xsl:value-of select="ALPRF"/>
                        </AlternativeItemPriority>
                        <AlternativeItemStrategy>
                            <xsl:value-of select="ALPST"/>
                        </AlternativeItemStrategy>
                        <UsageProbabilityPercent>
                            <xsl:value-of select="EWAHR"/>
                        </UsageProbabilityPercent>

                        <!-- Sample for indicating component AssembleAsRequired flag -->
                        <!-- <ZAssembleAsRequired>true</ZAssembleAsRequired>-->

                        <!-- Sample for specifying component tolerance -->
                        <!--
                        <ZMaximumToleranceInPct>11.123</ZMaximumToleranceInPct>
                        <ZMinimumToleranceInPct>10.123</ZMinimumToleranceInPct>
                        -->

                        <!-- Sample for custom field on component level
                        <CustomFieldList>
                            <CustomField>
                                <Attribute>XYZ</Attribute>
                                <Value>value_1</Value>
                            </CustomField>
                            <CustomField>
                                <Attribute>ABC</Attribute>
                                <Value>value_1</Value>
                            </CustomField>
                        </CustomFieldList>
                        -->

                    </pp:ManufacturingOrderComponent>
                </xsl:for-each>
                <xsl:for-each select="E1QAMVL">
                    <pp:ManufacturingOrderInspCharc>
                        <InspectionCharacteristic>
                            <xsl:value-of select="INSPCHAR"/>
                        </InspectionCharacteristic>
                        <InspectionSpecificationText>
                            <xsl:value-of select="CHAR_DESCR"/>
                        </InspectionSpecificationText>
                        <InspSpecCharacteristicType>
                            <xsl:value-of select="CHAR_TYPE"/>
                        </InspSpecCharacteristicType>
                        <InspSpecCharcCategory>
                            <xsl:value-of select="OBLIGATORY"/>
                        </InspSpecCharcCategory>
                        <InspSpecRecordingType>
                            <xsl:value-of select="SINGLE_RES"/>
                        </InspSpecRecordingType>
                        <InspCharacteristicSampleSize pp:unitCode="{SMPL_UNIT}">
                            <xsl:value-of select="SCOPE"/>
                        </InspCharacteristicSampleSize>
                        <InspectionScope>
                            <xsl:value-of select="SCOPE_IND"/>
                        </InspectionScope>
                        <InspResultIsDocumentationRqd>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="DOCU_REQU"/>
                            </xsl:call-template>
                        </InspResultIsDocumentationRqd>
                        <InspSpecDecimalPlaces>
                            <xsl:value-of select="DEC_PLACES"/>
                        </InspSpecDecimalPlaces>
                        <InspSpecTargetValue unitCode="{MEAS_UNIT}">
                            <xsl:value-of select="TARGET_VAL"/>
                        </InspSpecTargetValue>
                        <InspSpecLowerLimit unitCode="{MEAS_UNIT}">
                            <xsl:value-of select="LW_TOL_LMT"/>
                        </InspSpecLowerLimit>
                        <InspSpecUpperLimit unitCode="{MEAS_UNIT}">
                            <xsl:value-of select="UP_TOL_LMT"/>
                        </InspSpecUpperLimit>
                        <InspSpecLowerPlausibilityLimit unitCode="{MEAS_UNIT}">
                            <xsl:value-of select="LW_PLS_LMT"/>
                        </InspSpecLowerPlausibilityLimit>
                        <InspSpecUpperPlausibilityLimit unitCode="{MEAS_UNIT}">
                            <xsl:value-of select="UP_PLS_LMT"/>
                        </InspSpecUpperPlausibilityLimit>
                        <CharacteristicAttributeCatalog>
                            <xsl:value-of select="CAT_TYPE1"/>
                        </CharacteristicAttributeCatalog>
                        <SelectedCodeSet>
                            <xsl:value-of select="SEL_SET1"/>
                        </SelectedCodeSet>
                        <SelectedCodeSetPlant>
                            <xsl:value-of select="PSEL_SET1"/>
                        </SelectedCodeSetPlant>
                        <InspSpecInformationField1>
                            <xsl:value-of select="INFOFIELD1"/>
                        </InspSpecInformationField1>
                        <InspSpecInformationField2>
                            <xsl:value-of select="INFOFIELD2"/>
                        </InspSpecInformationField2>
                        <InspSpecInformationField3>
                            <xsl:value-of select="INFOFIELD3"/>
                        </InspSpecInformationField3>
                        <InspSpecIsDefectsRecgAutomatic>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="FEHLREC"/>
                            </xsl:call-template>
                        </InspSpecIsDefectsRecgAutomatic>
                        <InspLotIsSerialNumberRequired>
                            <xsl:call-template name="convertToBool">
                                <xsl:with-param name="bool" select="SERIALREQU"/>
                            </xsl:call-template>
                        </InspLotIsSerialNumberRequired>
                        <InspCharcSampleValuationType>
                            <xsl:value-of select="VALN_TYPE"/>
                        </InspCharcSampleValuationType>
                    </pp:ManufacturingOrderInspCharc>
                </xsl:for-each>

                <pp:LongText pp:languageCode="" pp:MIMECode="text/plain" pp:TextCategory=""/>

                <pp:ActivityNetworkElementSystemStatus>
                    <xsl:if test="E1JSTVL[STAT='I0001']">
                        <pp:CreatedStatusIsActive>true</pp:CreatedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0002']">
                        <pp:ReleasedStatusIsActive>true</pp:ReleasedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0007']">
                        <pp:PrintedStatusIsActive>true</pp:PrintedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0009']">
                        <pp:ConfirmedStatusIsActive>true</pp:ConfirmedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0010']">
                        <pp:PrtlyConfirmedStatusIsActive>true</pp:PrtlyConfirmedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0013']">
                        <pp:DeletedStatusIsActive>true</pp:DeletedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0045']">
                        <pp:TechlyCompletedStatusIsActive>true</pp:TechlyCompletedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0046']">
                        <pp:ClosedStatusIsActive>true</pp:ClosedStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0117']">
                        <pp:ScheduledStatusIsActive>true</pp:ScheduledStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0074']">
                        <pp:PrtlyDeliveredStatusIsActive>true</pp:PrtlyDeliveredStatusIsActive>
                    </xsl:if>
                    <xsl:if test="E1JSTVL[STAT='I0012']">
                        <pp:DeliveredStatusIsActive>true</pp:DeliveredStatusIsActive>
                    </xsl:if>
                </pp:ActivityNetworkElementSystemStatus>
                <pp:ManufacturingOrderMESReference>
                    <pp:MESOperation>
                        <xsl:value-of select="ME_OPERATION_ID"/>
                    </pp:MESOperation>
                    <pp:MESObjectVersion>
                        <xsl:value-of select="ME_REVISION"/>
                    </pp:MESObjectVersion>
                </pp:ManufacturingOrderMESReference>

                <!-- Sample to customizing resource type
                <ZResourceType>CUST_RES_TYPE</ZResourceType>
                -->

            </ManufacturingOrderActivityNetworkElement>

            <!-- sub-operation -->
            <xsl:for-each select="E1AFUVL[E1JSTUL[last()]/STAT!='I0013']">
                <ManufacturingOrderActivityNetworkElement>
                    <pp:MfgOrderNodeType>Suboperation</pp:MfgOrderNodeType>
                    <pp:MfgOrderNodeID>
                        <xsl:value-of select="concat('SUBOP', UVORN)" />
                    </pp:MfgOrderNodeID>
                    <pp:OrderInternalBillOfOperations />
                    <pp:OrderIntBillOfOperationsItem>
                        <xsl:value-of select="UVORN" />
                    </pp:OrderIntBillOfOperationsItem>
                    <pp:ManufacturingOrderOperation>
                        <xsl:value-of select="UVORN" />
                    </pp:ManufacturingOrderOperation>
                    <pp:ZMinimumSendAheadQuantity pp:unitCode="{MEINH}">
                        <xsl:value-of select="MINWE" />
                    </pp:ZMinimumSendAheadQuantity>
                    <pp:ZMinimumOverlapTime pp:unitCode="{ZEIMU}">
                        <xsl:value-of select="ZMINU" />
                    </pp:ZMinimumOverlapTime>
                    <pp:ManufacturingOrderSequence>
                        <xsl:value-of select="../../PLNFL" />
                    </pp:ManufacturingOrderSequence>
                    <!-- IDoc doesn't have ARBPL field
                    <pp:WorkCenter>
                      <xsl:value-of select="ARBPL" />
                    </pp:WorkCenter>
                    -->
                    <pp:WorkCenterInternalID>
                        <xsl:value-of select="ARBID" />
                    </pp:WorkCenterInternalID>
                    <pp:OpPlannedTotalQuantity pp:unitCode="{MEINH}">
                        <xsl:value-of select="MGVRG" />
                    </pp:OpPlannedTotalQuantity>
                    <pp:OperationReferenceQuantity pp:unitCode="{MEINH}">
                        <xsl:value-of select="BMSCH" />
                    </pp:OperationReferenceQuantity>
                    <pp:MfgOrderOperationText>
                        <xsl:value-of select="LTXA1" />
                    </pp:MfgOrderOperationText>
                    <pp:MfgOrderSequenceText>
                        <xsl:value-of select="../../LTXA1" />
                    </pp:MfgOrderSequenceText>
                    <pp:FactoryCalendar>
                        <xsl:value-of select="KALID" />
                    </pp:FactoryCalendar>
                    <pp:OpErlstSchedldExecStrtDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="FSAVD" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldExecStrtDte>
                    <pp:OpErlstSchedldExecStrtTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="FSAVZ" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldExecStrtTme>
                    <pp:OpErlstSchedldExecEndDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="FSEDD" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldExecEndDte>
                    <pp:OpErlstSchedldExecEndTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="FSEDZ" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldExecEndTme>
                    <pp:OpLtstSchedldExecStrtDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="SSAVD" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldExecStrtDte>
                    <pp:OpLtstSchedldExecStrtTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="SSAVZ" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldExecStrtTme>
                    <pp:OpLtstSchedldExecEndDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="SSEDD" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldExecEndDte>
                    <pp:OpLtstSchedldExecEndTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="SSEDZ" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldExecEndTme>
                    <pp:EarliestFinishOfOperationDate>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="FSEVD" />
                        </xsl:call-template>
                    </pp:EarliestFinishOfOperationDate>
                    <pp:EarliestFinishOfOperationTime>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="FSEVZ" />
                        </xsl:call-template>
                    </pp:EarliestFinishOfOperationTime>
                    <pp:OpErlstSchedldProcgStrtDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="FSSBD" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldProcgStrtDte>
                    <pp:OpErlstSchedldProcgStrtTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="FSSBZ" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldProcgStrtTme>
                    <pp:OpLtstSchedldProcgStrtDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="SSSBD" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldProcgStrtDte>
                    <pp:OpLtstSchedldProcgStrtTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="SSSBZ" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldProcgStrtTme>
                    <pp:OpPlannedProcessingDurn unitCode="{BEAZE}">
                        <xsl:value-of select="BEARZ" />
                    </pp:OpPlannedProcessingDurn>
                    <pp:OpErlstSchedldTrdwnStrtDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="FSSAD" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldTrdwnStrtDte>
                    <pp:OpErlstSchedldTrdwnStrtTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="FSSAZ" />
                        </xsl:call-template>
                    </pp:OpErlstSchedldTrdwnStrtTme>
                    <pp:OpLtstSchedldTrdwnStrtDte>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="SSSAD" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldTrdwnStrtDte>
                    <pp:OpLtstSchedldTrdwnStrtTme>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="SSSAZ" />
                        </xsl:call-template>
                    </pp:OpLtstSchedldTrdwnStrtTme>
                    <pp:LatestScheduledWaitEndDate>
                        <xsl:call-template name="convertIDocDateFormat">
                            <xsl:with-param name="date" select="SSELD" />
                        </xsl:call-template>
                    </pp:LatestScheduledWaitEndDate>
                    <pp:LatestScheduledWaitEndTime>
                        <xsl:call-template name="convertIDocTimeFormat">
                            <xsl:with-param name="time" select="SSELZ" />
                        </xsl:call-template>
                    </pp:LatestScheduledWaitEndTime>
                    <pp:OpPlannedSetupDurn unitCode="{RSTZE}">
                        <xsl:value-of select="RUEST" />
                    </pp:OpPlannedSetupDurn>
                    <pp:OpPlannedTeardownDurn unitCode="{ARUZE}">
                        <xsl:value-of select="ABRUE" />
                    </pp:OpPlannedTeardownDurn>
                    <pp:ScheduledWaitDuration unitCode="{ARUZE}">
                        <xsl:value-of select="ABRUE" />
                    </pp:ScheduledWaitDuration>
                    <pp:TeardownAndWaitIsParallel/>
                    <pp:MfgOrderConfirmationGroup />
                    <pp:OperationControlProfile pp:OperationControlKey="{STEUS}">
                        <!-- IDoc doesn't have RUEK field
                        <pp:CompletionConfirmation pp:CompletionConfirmationCode="{RUEK}">
                          <ConfirmationIsMilestoneConf>
                            <xsl:choose>
                              <xsl:when test="RUEK='1'">
                                <xsl:value-of select="true()" />
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="false()" />
                              </xsl:otherwise>
                            </xsl:choose>
                          </ConfirmationIsMilestoneConf>
                          <ConfirmationIsRequired>
                            <xsl:choose>
                              <xsl:when test="RUEK='2'">
                                <xsl:value-of select="true()" />
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="false()" />
                              </xsl:otherwise>
                            </xsl:choose>
                          </ConfirmationIsRequired>
                          <ConfirmationIsNotPossible>
                            <xsl:choose>
                              <xsl:when test="RUEK='3'">
                                <xsl:value-of select="true()" />
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="false()" />
                              </xsl:otherwise>
                            </xsl:choose>
                          </ConfirmationIsNotPossible>
                          <ConfirmationIsOptional>
                            <xsl:choose>
                              <xsl:when test="RUEK=(' ','0','') or empty(RUEK)">
                                <xsl:value-of select="true()" />
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="false()" />
                              </xsl:otherwise>
                            </xsl:choose>
                          </ConfirmationIsOptional>
                        </pp:CompletionConfirmation>
                        -->
                        <!-- Sub-Operation doesn't have E1AFVOL2 section
                        <pp:OperationIsScheduled>
                          <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/TERM" />
                          </xsl:call-template>
                        </pp:OperationIsScheduled>
                        <pp:CapacityRequirementsAreDtmnd>
                          <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/KAPA" />
                          </xsl:call-template>
                        </pp:CapacityRequirementsAreDtmnd>
                        <pp:GRIsPostedAutomatically>
                          <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/AUTWE" />
                          </xsl:call-template>
                        </pp:GRIsPostedAutomatically>
                        <pp:OperationIsNotMESRelevant>
                          <xsl:call-template name="convertToBool">
                            <xsl:with-param name="bool" select="E1AFVOL2/NOT_MES_REL" />
                          </xsl:call-template>
                        </pp:OperationIsNotMESRelevant>
                        -->
                    </pp:OperationControlProfile>
                    <pp:StandardWorkFormulaParamGroup StandardWorkFormulaParamGroupID="{VGWTS}">
                        <xsl:if test="VGE01 != ''">
                            <WorkCenterFormulaParam1 WorkCenterFormulaParamID="">
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <StandardWorkFormulaParamName languageCode="">
                                  <xsl:value-of select="E1AFVOL2/PAR01_LTXT" />
                                </StandardWorkFormulaParamName>
                                -->
                                <WorkCenterStandardWorkQty pp:unitCode="{VGE01}">
                                    <xsl:value-of select="VGW01" />
                                </WorkCenterStandardWorkQty>
                                <CostCtrActivityType>
                                    <xsl:value-of select="LAR01" />
                                </CostCtrActivityType>
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM1}">
                                  <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY1" />
                                </ToBeConfirmedTotalWorkQty>
                                -->
                            </WorkCenterFormulaParam1>
                        </xsl:if>
                        <xsl:if test="VGE02 != ''">
                            <WorkCenterFormulaParam2 WorkCenterFormulaParamID="">
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <StandardWorkFormulaParamName languageCode="">
                                  <xsl:value-of select="E1AFVOL2/PAR02_LTXT" />
                                </StandardWorkFormulaParamName>
                                -->
                                <WorkCenterStandardWorkQty pp:unitCode="{VGE02}">
                                    <xsl:value-of select="VGW02" />
                                </WorkCenterStandardWorkQty>
                                <CostCtrActivityType>
                                    <xsl:value-of select="LAR02" />
                                </CostCtrActivityType>
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM2}">
                                  <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY2" />
                                </ToBeConfirmedTotalWorkQty>
                                 -->
                            </WorkCenterFormulaParam2>
                        </xsl:if>
                        <xsl:if test="VGE03 != ''">
                            <WorkCenterFormulaParam3 WorkCenterFormulaParamID="">
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <StandardWorkFormulaParamName languageCode="">
                                  <xsl:value-of select="E1AFVOL2/PAR03_LTXT" />
                                </StandardWorkFormulaParamName>
                                -->
                                <WorkCenterStandardWorkQty pp:unitCode="{VGE03}">
                                    <xsl:value-of select="VGW03" />
                                </WorkCenterStandardWorkQty>
                                <CostCtrActivityType>
                                    <xsl:value-of select="LAR03" />
                                </CostCtrActivityType>
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM3}">
                                  <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY3" />
                                </ToBeConfirmedTotalWorkQty>
                                -->
                            </WorkCenterFormulaParam3>
                        </xsl:if>
                        <xsl:if test="VGE04 != ''">
                            <WorkCenterFormulaParam4 WorkCenterFormulaParamID="">
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <StandardWorkFormulaParamName languageCode="">
                                  <xsl:value-of select="E1AFVOL2/PAR04_LTXT" />
                                </StandardWorkFormulaParamName>
                                -->
                                <WorkCenterStandardWorkQty pp:unitCode="{VGE04}">
                                    <xsl:value-of select="VGW04" />
                                </WorkCenterStandardWorkQty>
                                <CostCtrActivityType>
                                    <xsl:value-of select="LAR04" />
                                </CostCtrActivityType>
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM4}">
                                  <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY4" />
                                </ToBeConfirmedTotalWorkQty>
                                -->
                            </WorkCenterFormulaParam4>
                        </xsl:if>
                        <xsl:if test="VGE05 != ''">
                            <WorkCenterFormulaParam5 WorkCenterFormulaParamID="">
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <StandardWorkFormulaParamName languageCode="">
                                  <xsl:value-of select="E1AFVOL2/PAR05_LTXT" />
                                </StandardWorkFormulaParamName>
                                -->
                                <WorkCenterStandardWorkQty pp:unitCode="{VGE05}">
                                    <xsl:value-of select="VGW05" />
                                </WorkCenterStandardWorkQty>
                                <CostCtrActivityType>
                                    <xsl:value-of select="LAR05" />
                                </CostCtrActivityType>
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM5}">
                                  <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY5" />
                                </ToBeConfirmedTotalWorkQty>
                                -->
                            </WorkCenterFormulaParam5>
                        </xsl:if>
                        <xsl:if test="VGE06 != ''">
                            <WorkCenterFormulaParam6 WorkCenterFormulaParamID="">
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <StandardWorkFormulaParamName languageCode="">
                                  <xsl:value-of select="E1AFVOL2/PAR06_LTXT" />
                                </StandardWorkFormulaParamName>
                                -->
                                <WorkCenterStandardWorkQty pp:unitCode="{VGE06}">
                                    <xsl:value-of select="VGW06" />
                                </WorkCenterStandardWorkQty>
                                <CostCtrActivityType>
                                    <xsl:value-of select="LAR06" />
                                </CostCtrActivityType>
                                <!-- Sub-Operation doesn't have E1AFVOL2 section
                                <ToBeConfirmedTotalWorkQty pp:unitCode="{E1AFVOL2/TO_BE_CONF_ACT_UOM6}">
                                  <xsl:value-of select="E1AFVOL2/TO_BE_CONF_ACTIVITY6" />
                                </ToBeConfirmedTotalWorkQty>
                                -->
                            </WorkCenterFormulaParam6>
                        </xsl:if>
                    </pp:StandardWorkFormulaParamGroup>

                    <pp:LongText pp:languageCode="" pp:MIMECode="text/plain" pp:TextCategory="" />

                    <pp:ActivityNetworkElementSystemStatus>
                        <xsl:if test="E1JSTUL[STAT='I0001']">
                            <pp:CreatedStatusIsActive>true</pp:CreatedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0002']">
                            <pp:ReleasedStatusIsActive>true</pp:ReleasedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0007']">
                            <pp:PrintedStatusIsActive>true</pp:PrintedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0009']">
                            <pp:ConfirmedStatusIsActive>true</pp:ConfirmedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0010']">
                            <pp:PrtlyConfirmedStatusIsActive>true</pp:PrtlyConfirmedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0013']">
                            <pp:DeletedStatusIsActive>true</pp:DeletedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0045']">
                            <pp:TechlyCompletedStatusIsActive>true</pp:TechlyCompletedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0046']">
                            <pp:ClosedStatusIsActive>true</pp:ClosedStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0117']">
                            <pp:ScheduledStatusIsActive>true</pp:ScheduledStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0074']">
                            <pp:PrtlyDeliveredStatusIsActive>true</pp:PrtlyDeliveredStatusIsActive>
                        </xsl:if>
                        <xsl:if test="E1JSTUL[STAT='I0012']">
                            <pp:DeliveredStatusIsActive>true</pp:DeliveredStatusIsActive>
                        </xsl:if>
                    </pp:ActivityNetworkElementSystemStatus>
                    <pp:ManufacturingOrderMESReference>
                        <pp:MESOperation>
                            <xsl:value-of select="ME_OPERATION_ID" />
                        </pp:MESOperation>
                        <pp:MESObjectVersion>
                            <xsl:value-of select="ME_REVISION" />
                        </pp:MESObjectVersion>
                    </pp:ManufacturingOrderMESReference>

                    <!-- Sample to customizing resource type
                    <ZResourceType>CUST_RES_TYPE</ZResourceType>
                    -->

                </ManufacturingOrderActivityNetworkElement>
            </xsl:for-each>
        </xsl:for-each>

        <xsl:for-each select="E1AFVOL[E1JSTVL[last()]/STAT!='I0013']">
            <xsl:sort select="VORNR"/>
            <xsl:choose>
                <xsl:when test="position() = 1">
                    <!-- start event -->
                    <ManufacturingOrderRelationship>
                        <PredecessorMfgOrderNodeType>StartEvent</PredecessorMfgOrderNodeType>
                        <PredecessorMfgOrderNodeID>
                            <xsl:value-of select="concat(//LOIPRO05/IDOC/E1AFKOL/AUFNR, 'SEVT')"/>
                        </PredecessorMfgOrderNodeID>
                        <SuccessorMfgOrderNodeType>Operation</SuccessorMfgOrderNodeType>
                        <SuccessorMfgOrderNodeID>
                            <xsl:value-of select="concat('OP', VORNR)"/>
                        </SuccessorMfgOrderNodeID>
                        <NetworkActivityRelationType>SucRel</NetworkActivityRelationType>
                    </ManufacturingOrderRelationship>
                </xsl:when>
                <xsl:otherwise>
                    <ManufacturingOrderRelationship>
                        <PredecessorMfgOrderNodeType>Operation</PredecessorMfgOrderNodeType>
                        <PredecessorMfgOrderNodeID>
                            <xsl:value-of select="concat('OP', preceding-sibling::E1AFVOL[1]/VORNR)"/>
                        </PredecessorMfgOrderNodeID>
                        <SuccessorMfgOrderNodeType>Operation</SuccessorMfgOrderNodeType>
                        <SuccessorMfgOrderNodeID>
                            <xsl:value-of select="concat('OP', VORNR)"/>
                        </SuccessorMfgOrderNodeID>
                        <NetworkActivityRelationType>SucRel</NetworkActivityRelationType>
                    </ManufacturingOrderRelationship>
                </xsl:otherwise>
            </xsl:choose>

            <xsl:if test="position() = last()">
                <!-- end event -->
                <ManufacturingOrderRelationship>
                    <PredecessorMfgOrderNodeType>Operation</PredecessorMfgOrderNodeType>
                    <PredecessorMfgOrderNodeID>
                        <xsl:value-of select="concat('OP', VORNR)"/>
                    </PredecessorMfgOrderNodeID>
                    <SuccessorMfgOrderNodeType>EndEvent</SuccessorMfgOrderNodeType>
                    <SuccessorMfgOrderNodeID>
                        <xsl:value-of select="concat(//LOIPRO05/IDOC/E1AFKOL/AUFNR, 'EEVT')"/>
                    </SuccessorMfgOrderNodeID>
                    <NetworkActivityRelationType>SucRel</NetworkActivityRelationType>
                </ManufacturingOrderRelationship>
            </xsl:if>

            <!-- sub-operation -->
            <xsl:for-each select="E1AFUVL[E1JSTUL[last()]/STAT!='I0013']">
                <xsl:sort select="UVORN"/>
                <ManufacturingOrderRelationship>
                    <PredecessorMfgOrderNodeType>Operation</PredecessorMfgOrderNodeType>
                    <PredecessorMfgOrderNodeID>
                        <xsl:value-of select="concat('OP', ../VORNR)"/>
                    </PredecessorMfgOrderNodeID>
                    <SuccessorMfgOrderNodeType>Suboperation</SuccessorMfgOrderNodeType>
                    <SuccessorMfgOrderNodeID>
                        <xsl:value-of select="concat('SUBOP', UVORN)"/>
                    </SuccessorMfgOrderNodeID>
                    <NetworkActivityRelationType>PChild</NetworkActivityRelationType>
                </ManufacturingOrderRelationship>
            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>

    <xsl:template match="/LOIPRO05/IDOC/E1AFKOL/E1VCCHR">
        <CharacteristicValuationOutb>
            <Characteristic>
                <xsl:value-of select="ATNAM"/>
            </Characteristic>
            <CharcValue>
                <xsl:value-of select="ATWRT"/>
            </CharcValue>
        </CharacteristicValuationOutb>
    </xsl:template>

    <xsl:template name="convertIDocDateFormat">
        <xsl:param name="date"/>
        <xsl:value-of
                select="concat(substring($date, 1, 4), '-', substring($date, 5, 2), '-', substring($date, 7, 2))"/>
    </xsl:template>

    <xsl:template name="convertIDocTimeFormat">
        <xsl:param name="time"/>
        <xsl:if test="$time != '' and $time != '000000'">
            <xsl:value-of
                select="concat(substring($time, 1, 2), ':', substring($time, 3, 2), ':', substring($time, 5, 2))"/>
        </xsl:if>
    </xsl:template>

    <xsl:template name="generateId">
        <!-- IDOC Number + TS -->
        <xsl:param name="idocNo"/>
        <xsl:variable name="dateStr"
                      select="format-dateTime(current-dateTime(),'[Y0001]-[M01]-[D01]-[H01].[m01].[s].[f]')"/>
        <xsl:variable name="dateStrNumOnly" select="replace($dateStr, '[^0-9]', '')"/>
        <xsl:value-of select="concat($idocNo, '-', $dateStrNumOnly)"/>
    </xsl:template>

    <xsl:template name="convertLanguageCode">
        <xsl:param name="spras"/>
        <xsl:attribute name="languageCode" namespace="http://sap.com/xi/PP/Global2">
            <xsl:choose>
                <!-- SPRAS refer to DB table T002 -->
                <!-- ISO code refer to http://www.lingoes.net/en/translator/langcode.htm -->
                <xsl:when test="$spras='E'">
                    <xsl:value-of select="'EN'"/>
                </xsl:when>
                <xsl:when test="$spras='1'">
                    <xsl:value-of select="'ZH'"/>
                </xsl:when>
                <xsl:when test="$spras='D'">
                    <xsl:value-of select="'DE'"/>
                </xsl:when>
                <xsl:when test="$spras='H'">
                    <xsl:value-of select="'HU'"/>
                </xsl:when>
                <xsl:when test="$spras='3'">
                    <xsl:value-of select="'KO'"/>
                </xsl:when>
                <xsl:when test="$spras='F'">
                    <xsl:value-of select="'FR'"/>
                </xsl:when>
                <xsl:when test="$spras='S'">
                    <xsl:value-of select="'ES'"/>
                </xsl:when>
                <xsl:when test="$spras='M'">
                    <xsl:value-of select="'ZF'"/>
                </xsl:when>
                <xsl:when test="$spras='J'">
                    <xsl:value-of select="'JA'"/>
                </xsl:when>
            </xsl:choose>
        </xsl:attribute>
    </xsl:template>

    <xsl:template name="getMaterial">
        <xsl:param name="material"/>
        <xsl:param name="materialExt"/>
        <xsl:param name="materialLong"/>
        <xsl:variable name="materialString">
            <xsl:choose>
                <xsl:when test="$materialExt!=''">
                    <xsl:value-of select="normalize-space($materialExt)"/>
                </xsl:when>
                <xsl:when test="$materialLong!=''">
                    <xsl:value-of select="normalize-space($materialLong)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="normalize-space($material)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialMask">
            <xsl:choose>
                <xsl:when test="string-length($materialExt) > 18">
                    <xsl:value-of select="'0000000000000000000000000000000000000000'"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="'000000000000000000'"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialNumber" select="string(number($materialString))"/>
        <xsl:choose>
            <xsl:when test="$materialNumber='NaN'">
                <xsl:value-of select="$materialString"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="format-number(number($materialNumber), $materialMask)"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="convertToBool">
        <xsl:param name="bool"/> <!-- 'X' -->
        <xsl:choose>
            <xsl:when test="$bool='X'">
                <xsl:value-of select="true()"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="false()"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="addWorkInstructionName">
        <xsl:param name="docName"/>
        <xsl:param name="docType"/>
        <xsl:param name="docPart"/>
        <xsl:param name="docOriginal"/>
        <xsl:param name="shopOrder"/>
        <xsl:value-of select="concat($shopOrder, $docName,'-', $docType,'-',  $docPart,'-', $docOriginal)"/>
    </xsl:template>

    <xsl:template name="addMaterial">
        <xsl:param name="material"/>
        <xsl:param name="materialExt"/>
        <xsl:param name="materialLong"/>
        <xsl:variable name="materialString">
            <xsl:choose>
                <xsl:when test="$materialExt!=''">
                    <xsl:value-of select="normalize-space($materialExt)"/>
                </xsl:when>
                <xsl:when test="$materialLong!=''">
                    <xsl:value-of select="normalize-space($materialLong)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="normalize-space($material)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialMask">
            <xsl:choose>
                <xsl:when test="string-length($materialExt) > 18">
                    <xsl:value-of select="'0000000000000000000000000000000000000000'"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="'000000000000000000'"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="materialNumber" select="number($materialString)"/>
        <xsl:choose>
            <xsl:when test="format-number($materialNumber, '#') = $materialString">
                <!-- material is number -->
                <xsl:value-of select="format-number($materialNumber, $materialMask)"/>
            </xsl:when>
            <xsl:otherwise>
                <!-- material contains letter -->
                <xsl:value-of select="$materialString"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
