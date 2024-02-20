import com.sap.gateway.ip.core.customdev.util.Message
import org.codehaus.groovy.runtime.InvokerHelper
import groovy.util.slurpersupport.GPathResult
import groovy.xml.XmlUtil

def Message processData(Message message) {
	
    def props = message.getProperties()
    def CONFHIST1 = props.get("ZCONFHIST1")
     def CONFHIST2 = props.get("ZCONFHIST2")
    String oriPayload = message.getProperty("originalBody")
	
	Node root = new XmlParser().parseText(oriPayload)
	root."IDOC"[0]."E1AFKOL"[0].appendNode("ZCONFHIST1", CONFHIST1)
	root."IDOC"[0]."E1AFKOL"[0].appendNode("ZCONFHIST2", CONFHIST2)
	message.setBody(XmlUtil.serialize(root));
	return message
}

